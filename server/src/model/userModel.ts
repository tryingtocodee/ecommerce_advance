import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        minlength : [5 , "minimum 5 character required"] ,
        maxlength : [20 , "minimum 5 character required"] ,
        required : true
    },
    email : {
        type : String,
        minlength : [5 , "minimum 5 character required"] ,
        maxlength : [40 , "minimum 5 character required"] ,
        required : true ,
        unique : true
    },
    password : {
        type : String,
        minlength : [5 , "minimum 5 character required"] ,
        required : true
    },
    role : {
        type :String,
        enum : ["user" , "admin"] ,
        default : "user"
    },
    isVerified : {
        type : Boolean ,
        default : false
    },
    emailToken : {
        type : String,
        unique : true,
        expires : 3600,
        default : ""
    }
}, {timestamps : true})

export const User = mongoose.model("User" , userSchema)