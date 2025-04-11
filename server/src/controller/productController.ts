import { Request , Response } from "express";
import { Product } from "../model/productModel";
import { productUpdate, requiredInAddProduct } from "../zodValidate/products";

import { validate } from "uuid";
import cloudinary from "../config/cloudinary";
import { upload } from "../config/multer";

export const getAllProducts = async(req : Request , res : Response ) : Promise<any> => {
    try {

        const  page = Number(req.query.page as string) || 1
        const limit = Number(req.query.limit as string) || 10
        const category = req.query.category as string 
        const filter =  category ? {category : category } : {}


        const skip = (page - 1) * limit

        const [product , total] = await Promise.all([
            Product.find(filter).skip(skip).limit(limit) , Product.countDocuments()
        ])

        if(product.length == 0){
            return res.status(400).json("no products added yet")
        }

        return res.json({
            message : "products send",
            product , 
            pagination : {
                totalProducts : total ,
                totalPages : (total / limit) ,
                currentPage : page 
            }
        })
    } catch (e : any) {
        console.log("error in getallproduct" , e.message)
        return res.status(500).json("Internal Server Error")
    }
}

export const getProductId = async(req : Request , res : Response ) : Promise<any> => {
    try {
        const productId = req.params.productId


        const product = await Product.findById({productId})

        if(!product){
            return res.json("no product with this products id found ")
        }

        return res.json({
            message : "product id found" ,
            product : product ,
        })
    } catch (e : any) {
        console.log("error in getProductId" , e.message)
        return res.status(500).json("Internal Server Error")
    }
}

export const addProduct = async(req: Request, res: Response): Promise<any> => {
    try {
        const validateData = requiredInAddProduct.safeParse(req.body);

        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                errors: validateData.error.errors
            });
        }

        const userId = req.user?._id;
        const { title, description, price, images, stock, category } = validateData.data;

        const existingProduct = await Product.findOne({ userId, title, category });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: "A product with this title already exists in this category"
            });
        }
        console.log("reached here")
        const uploadedImage = await cloudinary.uploader.upload(req.file?.path || "");

        console.log("reached after upload image ")

        
        const newProduct = new Product({
            userId,
            title,
            description,
            price,
            stock,
            category,
            images: [{
                imageUrl: uploadedImage.secure_url,
                imageId: uploadedImage.public_id
            }]
        });
        console.log(uploadedImage.secure_url , uploadedImage)
        console.log(newProduct)

        await newProduct.save();
        return res.status(201).json({
            success: true,
            message: "Product added",
            product: newProduct
        });

    } catch (e: any) {
        console.error("Error in addProduct:", e.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


export const updateProduct = async(req : Request , res : Response ) : Promise<any> => {
    try {
        const productId = req.params.productId 

        const userId = req.user?._id

        const validateData = productUpdate.safeParse(req.body)

        if(!validateData.success){
            return res.json({
                success : false ,
                error : validateData.error.errors
            })
        }

        const {title , description , images , stock , price , category} = validateData.data

        const product = await Product.findOne({userId : userId , _id : productId})

        if(!product){
            return res.json("no product found with this product id ")
        }

        product.title = title || product.title 
        product.description = description || product.description
        product.stock = stock  || product.stock
        product.price = price || product.price
        product.category = category || product.category
        
        if(images && images.length > 0){
            //destroy image from cloudinary 
            for (const img of product.images){
                await cloudinary.uploader.destroy(img.imageId)
            }

           product.updateOne( {_id : productId} , {$set : {images : []}})

           

            for(const img of images){
                const uploadNewImage = await cloudinary.uploader.upload(req.file?.path || "")

                product.images.push({
                    imageUrl: uploadNewImage.secure_url ,
                    imageId : uploadNewImage.public_id
                })
            }
        }

        await product.save()

        return res.json({
            message :"update product" ,
            updatedProduct : product
        })
        
    } catch (e : any) {
        console.log("error in updateProduct" , e.message)
        return res.status(500).json("Internal Server Error")
    }
}

export const deleteProduct = async(req : Request , res : Response ) : Promise<any> => {
    try {
        const userId = req.user?._id

        const productId = req.params.productId

        const product = await Product.findOneAndDelete({_id : productId} , {userId : userId})

        if(!product){
            return res.json("no product found with this id ")
        }

        return res.json("product deleted")
        

    } catch (e : any) {
        console.log("error in deleteProduct" , e.message)
        return res.status(500).json("Internal Server Error")
    }
}


