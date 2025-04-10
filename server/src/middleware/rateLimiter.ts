import { redis } from "../config/redis";
import { NextFunction, Request, Response } from "express";

const fixedWindowRateLimiter = async(req : Request , res : Response , next : NextFunction) =>{
    try {
        const ttl = 60 
        const maxRequests = 5

        const ip = req.ip 
        
        if(!ip){
            return res.json("request ip is undefined cannot apply rate limiter ")
            next()
        }

        const key = `rate_limit:${ip}`

        const currentCount = await redis.incr(key)

        if( currentCount == 1 ){
            redis.expire(key , ttl).catch((e)=>{
                console.log("failed to set expiry to request" , e.message)
            })
        }

        if(currentCount > maxRequests ){
            return res.status(429).json("max request limit reached . wait for 1 min to send new request")
        }


        next()

    } catch (e : any) {
        console.log("error in fixed window rate limiter" , e.message)
        return 
    }
}