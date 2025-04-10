import { Request, Response } from "express"
import { User } from "../model/userModel"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcrypt, { hash } from "bcryptjs"
import { v4 as uuidv4 } from 'uuid';
import { setCookie } from "../utils/setCookie"
import { userDelete, userLogin, userSignup, userUpdate } from "../zodValidate/user"

dotenv.config()

const jwtSecret = process.env.JWT_SECRET

export const signUp = async(req :Request , res : Response ) : Promise<any> => {
    try {
        const validateData = userSignup.safeParse(req.body)

        if(!validateData.success){
            return res.status(400).json({
                success : false ,
                errors : validateData.error.errors
            })
        }

        const {username , email , password , role  }  = validateData.data

        const userExists = await User.findOne({email}) 

        if(userExists){
            return res.json("user already exits with this email")
        }

        if(!jwtSecret){
            console.log("jwt secret not found ")
            return
        }

        const token = jwt.sign({email} , jwtSecret , {expiresIn : "1h"})

        const hashedPasword = await bcrypt.hash(password , 10 )

        setCookie(res , token)

        

        const newUser = new User({
            username ,
            email ,
            password : hashedPasword,
            role 
        })


        await newUser.save()

        return res.json({
            msg : "created user succesfully",
            user : newUser 
        })

    } catch (e : any) {
        console.log("error in signup" , e.message)
       return res.json("Internal Server Error")
    }
}

export const login = async(req :Request , res : Response ) : Promise<any> => {
    try {
        const validateData = userLogin.safeParse(req.body)

        if(!validateData.success){
            return res.status(400).json({
                success : false ,
                errors : validateData.error.errors
            })
        }

        const {email , password } = validateData.data

        const userExists = await User.findOne({email})

        if(!userExists){
            return res.status(400).json("no user found with this email")
        }

        if(!jwtSecret){
            console.log("no jwt secret found ")
            return 
        }

        const token = jwt.sign({email} , jwtSecret , {expiresIn : "1h"} )

        setCookie(res , token)

        const verifyPassword = await bcrypt.compare(password , userExists.password)

        if(!verifyPassword){
            return res.status(400).json("incorrect password")
        }

        const withoutPassword = await User.findOne({email}).select("-password")

        return res.json({
            msg : "logged in successfully" ,
            user : withoutPassword
        })

    } catch (e : any) {
        console.log("error in login" , e.message)
       return res.json("Internal Server Error")
    }
}


export const logout = async(req :Request , res : Response ) : Promise<any> => {
    try {

        const token = req.cookies.token

        if(!token){
            return res.status(400).json("token not found ")
        }

        res.clearCookie("token")

        return res.json("logged out successfully")
    } catch (e : any) {
        console.log("error in logout" , e.message)
       return res.json("Internal Server Error")
    }
}


export const deleteUser = async(req :Request , res : Response ) : Promise<any> => {
    try {
        const validateData = userDelete.safeParse(req.body)

        if(!validateData.success){
            return res.status(400).json({
                success : false ,
                errors : validateData.error.errors
            })
        }

        const {email} = validateData.data

        const user = await User.findOneAndDelete({email})

        if(!user){
            return res.status(400).json("no user found with this email")
        }

        return res.json("user deleted successfully")

    } catch (e : any) {
        console.log("error in deleteUser" , e.message)
       return res.json("Internal Server Error")
    }
}

export const update = async(req :Request , res : Response ) : Promise<any> => {
    try {

        const validateData = userUpdate.safeParse(req.body)

        if(!validateData.success){
            return res.json({
                success : false,
                errors : validateData.error.errors
            })
        }
        const {username , email , password  } = validateData.data

        const userId = req.user?._id

        const user = await User.findById(userId)

        if(!user){
            return res.json("no user found")
        }


        user.username = username || user.username
        user.email = email || user.email

        if(password){
            const hashPassword = await bcrypt.hash(password , 10)
            user.password = hashPassword
        }
        
        await user.save()
        
        const withoutPassword = await User.findById(userId)

        

        return res.json({
            msg : "updated user successfully" ,
            user : withoutPassword
        })

    } catch (e : any) {
        console.log("error in signup" , e.message)
       return res.json("Internal Server Error")
    }
}
