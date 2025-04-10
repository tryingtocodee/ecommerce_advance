import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"


dotenv.config()
export const cloudinaryConfig = async () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
    } catch (e: any) {
        console.log("error in cloudinary config" , e.message)
    }
}