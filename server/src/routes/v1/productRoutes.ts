import express from "express"
import { addProduct, deleteProduct, getAllProducts, getProductId, updateProduct } from "../../controller/productController"
import { adminRoutes, protectedRoutes } from "../../middleware/protectedRoutes"
import { emailVerificationCheck } from "../../middleware/emailVerify"
import { upload } from "../../config/multer"

const router = express.Router()

//query params to get page and limit 
router.get("/" , getAllProducts)

router.get("/:productId" , getProductId)

//admin 
router.post("/" , upload.single("image") , protectedRoutes , adminRoutes , emailVerificationCheck , addProduct)
router.put("/:productId" , protectedRoutes , adminRoutes , emailVerificationCheck , updateProduct)
router.delete("/:productId" , protectedRoutes , adminRoutes , emailVerificationCheck , deleteProduct)

export default router 