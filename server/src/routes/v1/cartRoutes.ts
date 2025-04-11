import express from "express"
import { protectedRoutes } from "../../middleware/protectedRoutes"
import { addProductToCart, clearCartAfterOrder, getAllProductsInCart, placeOrder, updateCart } from "../../controller/cartController"

const router = express.Router()

router.post("/add", protectedRoutes , addProductToCart)
router.get("/" , protectedRoutes , getAllProductsInCart)
router.put("/" , protectedRoutes , updateCart)
router.post("/" , protectedRoutes , placeOrder)
router.put("/" , protectedRoutes , clearCartAfterOrder)




export default router 