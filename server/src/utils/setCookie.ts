import { Response } from "express";

export const setCookie = async(res : Response , token : string) =>{
    try {
        res.cookie("token" , token , {
            httpOnly : true ,
            sameSite :"strict",
            maxAge : 60 * 60  * 1000
        })
    } catch (e : any) {
        console.log("error in setCookie" , e.message)
        return res.status(500).json("Internal Server Error")
    }
}