import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { User } from "../model/userModel";
import dotenv from  "dotenv"
import { Document } from "mongoose";


interface IUser extends Document {
    username : string ,
    email : string ,
    password : string ,
    role  : string 
}

declare global {
    namespace Express {
        interface Request {
            user : IUser | null
        }
    }
}

dotenv.config()

const jwtSecret = process.env.JWT_SECRET


interface userJwtPayload extends JwtPayload {
    email : string
}

export const protectedRoutes = async (req : Request , res : Response , next : NextFunction) : Promise<any> =>{
    try {
        const token = req.cookies.token

        if(!token) {
            return res.status(400).json("no token found")
        }

        if(!jwtSecret){
            console.log("no jwt secret found")
            return 
        }
        const decode = jwt.verify(token , jwtSecret) as userJwtPayload

        if(!decode){
            return res.status(400).json("incorrect token")
        }

        const user = await User.findOne({email : decode.email}) 

        req.user = user

        next()
    } catch (e : any) {
        console.log("error in protectedRoutes" , e.message)
        return res.status(500).json("Internal server error")
    }
}

export const adminRoutes = async (req : Request , res : Response , next : NextFunction) : Promise<any> =>{ 
    try {
        if(req.user && req.user.role == "admin"){
            next()
        }else {
            return res.json("authorized . you need to be admin to acces this route")
        }
    } catch (e : any) {
        console.log("error in admin routes " , e.message)
        return res.json("Internal server error")        
    }
}