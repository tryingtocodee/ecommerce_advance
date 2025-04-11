import express from "express"
import { protectedRoutes } from "../../middleware/protectedRoutes"
import { addOrder, deleteOrder, getAllOrders, cancelOrder } from "../../controller/orderRoutes"

const router = express.Router()

router.get("/" , protectedRoutes , getAllOrders)
router.post("/" , protectedRoutes , addOrder)
router.put("/:orderId" , protectedRoutes , cancelOrder)
router.delete("/:orderId" , protectedRoutes , deleteOrder)


export default router