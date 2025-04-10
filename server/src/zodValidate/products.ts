import {z} from "zod" ;

const addProduct = z.object({
    title : z.string().min(5 , {message : "minimum 5 charactre required"}).max(40 , {message : "max 40 charactre required"}),
    description : z.string().min(5 , {message : "minimum 5 charactre required"}).max(40 , {message : "max 40 charactre required"}),
    images : z.optional(z.string()),
    price : z.coerce.number(),
    stock : z.coerce.number(),
    category : z.enum(["shirt" , "t-shirt" , "jeans" , "jacket"])
})

export const requiredInAddProduct = addProduct.required({
    title : true ,
    description : true,
    price : true ,
    stock : true ,
    category :true ,
}) 

export const productUpdate = z.object({
    title : z.string().min(5 , {message : "minimum 5 charactre required"}).max(40 , {message : "max 40 charactre required"}),
    description : z.string().min(5 , {message : "minimum 5 charactre required"}).max(40 , {message : "max 40 charactre required"}),
    images : z.string(),
    price : z.number(),
    stock : z.number(),
    category : z.enum(["shirt" , "t-shirt" , "jeans" , "jacket"])
})


