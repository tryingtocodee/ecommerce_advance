import express from "express"
import dotenv from "dotenv"
import { dbConnect } from "./config/dbConfig"
import authRoutes from "./routes/v1/authRoutes"
import cookieParser from "cookie-parser"
import emailRoutes from "./routes/v1/emailVerify"
import { recieveQueue } from "./notification_system"
import productRoutes from "./routes/v1/productRoutes"


dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())


const port = process.env.PORT

app.use("/api/v1/auth" , authRoutes)
app.use("/api/v1/email" , emailRoutes)
app.use("/api/v1/products" , productRoutes)

app.get("/" , (req , res ) : any=>{
    return res.send("hello")
})

app.listen(port , ()=>{
    console.log("port on " , port)
    dbConnect()
    recieveQueue().then(()=>console.log("email queue started successfully"))
})