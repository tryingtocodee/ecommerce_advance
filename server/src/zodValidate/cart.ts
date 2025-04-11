import {z} from "zod"

export const productToCart = z.object({
    productId : z.string(),
    quantity : z.number()
}) 

export const updateToCart = z.object({
    productId : z.string(),
    quantity : z.number()
}) 