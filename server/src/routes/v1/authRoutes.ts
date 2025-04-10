import express from "express"
import { deleteUser, login, logout, signUp, update } from "../../controller/authController"
import { protectedRoutes } from "../../middleware/protectedRoutes"

const router = express.Router()

router.post("/signup" , signUp)
router.post("/login" , login)
router.post("/logout" , logout)
router.post("/delete" , deleteUser)
router.post("/update" , protectedRoutes , update)


export default router;