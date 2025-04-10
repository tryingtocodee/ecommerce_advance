import express from "express"
import { forgotPassword, requestEmail, verifyEmail } from "../../controller/emailController"
import { protectedRoutes } from "../../middleware/protectedRoutes"

const router = express.Router()

router.post("/request-email", protectedRoutes , requestEmail)
router.post("/verify-email/:token" , protectedRoutes , verifyEmail)


export default router