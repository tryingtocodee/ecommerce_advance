import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()


export const dbConnect = async () =>{
    try {
        const db = process.env.DBCONNECTION

        if(!db){
            console.log("db not found from env ")
            return 
        }
        await mongoose.connect(db)
        console.log("connected to db ")
    } catch (e : any) {
        console.log("error in dbConnect" , e.message)
        return 
    }
}