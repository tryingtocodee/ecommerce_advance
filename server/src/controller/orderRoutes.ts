import { Request, Response } from "express"
import { Order } from "../model/orderModel"
import { Cart } from "../model/cartModel"


export const getAllOrders = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.user?._id

        if (!userId) {
            return res.json("no user found . plz login again ")
        }
        const order = await Order.findById(userId)

        if (!order) {
            return res.json("no order found")
        }

        return res.json({
            message: "order found",
            order
        })
    } catch (e: any) {
        console.log("error in getAllOrders", e.message)
        return res.json("Internal Server Error")
    }
}



export const addOrder = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.user?._id

        const cart = await Cart.findById(userId).populate("items.productId")

        if (!cart) {
            return res.json(" no cart found . add products to cart first")
        }
        const orders = []

        for (const item of cart.items) {
            const product: any = item.productId

            if (product?.stock < item.quantity) {
                return res.json({
                    message: "we dont have enough stock",
                    stock: product.stock
                })
            }

            product.stock -= item.quantity

            await product.save()

            const order = new Order({
                userId,
                productId: product._id,
                price: product.price * item.quantity,
                orderStatus: "recieved"
            })
            await order.save()
            orders.push(order)

        }

        return res.json({
            message: "order recieved",
            orders
        })


    } catch (e: any) {
        console.log("error in addOrder", e.message)
        return res.json("Internal Server Error")
    }
}


export const cancelOrder = async (req: Request, res: Response): Promise<any> => {
    try {
        const orderId = req.params.orderId

        const userId = req.user?._id

        const order = await Order.findByIdAndUpdate(orderId)

        if (!order) {
            return res.json("no order found")
        }


        if (order?.userId.toString() != userId?.toString()) {
            return res.json("unauthorized")
        }

        if (order.orderStatus === "cancelled" || order.orderStatus === "shipped") {
            return res.json(`orders already ${order.orderStatus}`)
        }


        order.orderStatus = "cancelled"

        await order.save()

        return res.json("order status changed to cancel")

    } catch (e: any) {
        console.log("error in cancelOrder", e.message)
        return res.json("Internal Server Error")
    }
}



export const deleteOrder = async (req: Request, res: Response): Promise<any> => {
    try {
        const orderId = req.params.orderId

        const order = await Order.findByIdAndDelete(orderId)

        if (!order) {
            return res.json("no order found")
        }

        return res.json("order deleted")

    } catch (e: any) {
        console.log("error in deleteOrder", e.message)
        return res.json("Internal Server Error")
    }
}