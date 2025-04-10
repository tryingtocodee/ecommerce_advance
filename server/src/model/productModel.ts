import mongoose, { mongo } from "mongoose"

const productSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User" ,
        required : true
    },
    title : {
        type : String,
        required : true,
        minlength : [5 , "minimum 5 charactre required"] ,
        maxlength : [40 , "max 40 charactre required"]
    },
    description : {
        type : String,
        required : true,
        minlength : [5 , "minimum 5 charactre required"] ,
        maxlength : [40 , "max 40 charactre required"]
    },
    images : [{
        image : {
            type : String,
            required : true
        }
    }] ,
    price : {
        type : Number ,
        required : true
    },
    stock : {
        type : Number ,
        default : 0 ,
        requried : true
    },

},{timestamps : true})

export const Product = mongoose.model("Product" , productSchema)