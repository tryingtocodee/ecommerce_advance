import {z} from "zod"

export const userSignup = z.object({
    username : z.string().min(5 , {message : "must be 5 character or more" }).max(20 , {message : "must be less than 20 characters"}),
    email : z.string().email({message : "invalid email address"}).min(5 , {message : "must be 5 or more characters"}),
    password : z.string().min(5 , {message : "must be 5 or more characters"}).max(20 , {message : "must be less than 20 characters"}),
    role : z.enum(["user" , "admin"])
})

export const userLogin = z.object({
    email : z.string().email({message : "invalid email address"}).min(5 , {message : "must be 5 or more characters"}).max(40 , {message : "must be less than 20 characters"}),
    password : z.string().min(5 , {message : "must be 5 or more characters"}).max(20 , {message : "must be less than 20 characters"}),
})

export const userDelete = z.object({
    email : z.string().email({message : "invalid email address"}).min(5 , {message : "must be 5 or more characters"}).max(40 , {message : "must be less than 20 characters"}),
})


export const userUpdate = z.object({
    username : z.optional(z.string().min(5 , {message : "must be 5 character or more" }).max(20 , {message : "must be less than 20 characters"})),
    email : z.optional(z.string().email({message : "invalid email address"}).min(5 , {message : "must be 5 or more characters"}).max(40 , {message : "must be less than 20 characters"})),
    password : z.optional(z.string().min(5 , {message : "must be 5 or more characters"}).max(20 , {message : "must be less than 20 characters"})),

})