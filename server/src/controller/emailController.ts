import { Request , NextFunction, Response } from "express";
import { User } from "../model/userModel";
import { v4 as uuidv4 } from 'uuid'
import { sendingEmalVerification } from "../notification_system";

export const requestEmail = async(req :Request , res :Response , next : NextFunction ) :Promise<any> => {
    try {
        const userId = req.user?._id

        const user = await User.findById(userId)

        if(!user){
            return res.json("no user found ")
        }
        
        const now = new Date()

        if(user.emailTokenExpires && user.emailTokenExpires > now){
            return res.json("email already send . check your email ")
        }

        const emailToken : string = uuidv4();


       user.emailToken = emailToken
       user.emailTokenExpires = new Date(Date.now() + 3600 * 1000)

       await user.save()
    
       await sendingEmalVerification({
        email : user.email ,
        username : user.username ,
        emailToken : emailToken
       })
       
       return res.json("email send to you")

    } catch (e : any) {
        console.log("error in requestEmail" , e.message)
        return res.json("Internal server error")
    }
}



export const verifyEmail = async(req :Request , res :Response , next : NextFunction ) :Promise<any> => {
    try {
        const {token} = req.params

        const userId = req.user

        if(!userId){
            return res.json("userId not found ")
        }

        const user = await User.findById(userId?._id)

        if(!user){
            return res.json("user not found")
        }

       if(user.emailToken != token){
        return res.json("icorrect email verify token plz login again and request new verify email ")
       }

       if(user.emailTokenExpires  && user.emailTokenExpires < new Date() ){
        return res.json("token expired request new email ")
       }

       user.isVerified = true
       user.emailToken = ""
       user.emailTokenExpires = undefined

       return res.json("user verified ")

    } catch (e : any) {
        console.log("error in requestEmail" , e.message)
        return res.json("Internal server error")
    }
}



export const forgotPassword = async(req :Request , res :Response , next : NextFunction ) :Promise<any> => {
    try {
        
    } catch (e : any) {
        console.log("error in requestEmail" , e.message)
        return res.json("Internal server error")
    }
}