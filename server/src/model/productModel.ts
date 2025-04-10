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
        maxlength : [40 , "max 40 charactre required"],
        unique : true
    },
    description : {
        type : String,
        required : true,
        minlength : [5 , "minimum 5 charactre required"] ,
        maxlength : [40 , "max 40 charactre required"]
    },
    images : [{
        imageUrl : {
            type : String,
            required : true
        },
        imageId : {
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
    category : {
        type : String,
        required : true ,
        enum : ["shirt" , "t-shirt" , "jeans" , "jacket"]
    }
},{timestamps : true})

export const Product = mongoose.model("Product" , productSchema)