import { NextFunction, Response  , Request } from "express";
import { User } from "../model/userModel";

export async function emailVerificationCheck (req : Request , res : Response , next : NextFunction):Promise<any> {
    try {
        const userId = req.user
        
        if(!userId){
            return res.status(400).json("userId not found . log in again ")
        }

        const user = await User.findById(userId._id)

        if(user?.isVerified == false ){
            return res.status(400).json("email needs to be verified to access this resource")
        }

        next()
    } catch (e : any) {
        console.log("error in email verification check function" , e.message)
        return res.status(500).json("Internal server error ")
    }
}