import { Request, Response } from "express"
import { Cart } from "../model/cartModel"
import { Product } from "../model/productModel"
import { productToCart, updateToCart } from "../zodValidate/cart"
import { Order } from "../model/orderModel"


export const addProductToCart = async (req: Request, res: Response): Promise<any> => {
    try {

        const validateData = productToCart.safeParse(req.body)

        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                error: validateData.error.errors
            })
        }
        const { productId, quantity } = validateData.data

        const userId = req.user?._id

        if (!userId) {
            return res.json(" no user found ")
        }
        const product = await Product.findById(productId)

        if (!product) {
            return res.json("no product found with this product id ")
        }
        if (quantity > product.stock) {
            return res.json({
                message: "we dont have enough stock . stock available is : ",
                stock: product?.stock
            })
        }
        const cart = await Cart.findById(userId)

        if (!cart) {
            //if cart is not found then create new cart for user 
            const cart = new Cart({
                userId,
                items: [{ productId, quantity }]
            })
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => item.productId?.toString() === productId
            )

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity = cart.items[itemIndex].quantity + quantity
            } else {
                //if productId is found then update quantity 
                cart.items.push({ productId, quantity })
            }
        }

        await cart?.save()

        return res.json({
            message: "products added to cart",
            cart: cart
        })

    } catch (e: any) {
        console.log("error in addProductToCart", e.message)
        return res.json("Internal Server Error")
    }
}

export const getAllProductsInCart = async (req: Request, res: Response): Promise<any> => {
    try {

        const userId = req.user?._id

        const findUser = await Cart.findById(userId)

        if (!findUser) {
            return res.json("no user found")
        }

        if (findUser.items.length == 0) {
            return res.json("no items added in the cart")
        }

        return res.json({
            message: "all the items in the cart",
            items: findUser.items
        })

    } catch (e: any) {
        console.log("error in getAllProductsInCart", e.message)
        return res.json("Internal Server Error")
    }
}

export const updateCart = async (req: Request, res: Response): Promise<any> => {
    try {

        const validateDate = updateToCart.safeParse(req.body)

        if (!validateDate.success) {
            return res.status(400).json({
                success: false,
                error: validateDate.error.errors
            })
        }

        const userId = req.user?._id

        const { quantity, productId } = validateDate.data

        const product = await Product.findById(productId)

        if (!product) {
            return res.json("no product found")
        }

        const cart = await Cart.findById(userId)


        if (!cart) {
            return res.json("cart not found")
        }


        const itemIndex = cart.items.findIndex((item) => item.productId?.toString() == productId)

        if (itemIndex === -1) {
            return res.json("product not found in cart ")
        }

        if (product.stock < quantity) {
            return res.json({
                message: "no enough stock",
                stock: product.stock
            })
        }


        cart.items[itemIndex].quantity = cart.items[itemIndex].quantity + quantity


        await cart.save()

        return res.json({
            message: "cart updated",
            cart: cart
        })

    } catch (e: any) {
        console.log("error in updateCart", e.message)
        return res.json("Internal Server Error")
    }
}


export const placeOrder = async (req: Request, res: Response): Promise<any> => {
    try {

    const userId = req.user?._id

    const cart = await Cart.findOne({userId}).populate("items.productId")

    if(!cart || cart.items.length == 0){
        return res.json("no product found in cart")
    }

    const orders= []

    for(const item of cart.items){
        const product  : any = item.productId

        if(!product || product.stock < item.quantity ){
            return res.json({
                message : "no enough stock",
                stockAvailable : product.stock
            })
        }

        product.stock -= item.quantity

        await product.save()


        const order = new Order ({
            userId ,
            productId : product._id,
            price  : product.price * item.quantity,
            orderStatus : "recieved"
        })
        await order.save()

        orders.push(order)

    }

    return res.json({
        message : "order placed",
        orders
    })

    } catch (e: any) {
        console.log("error in placeOrder", e.message)
        return res.json("Internal Server Error")
    }
}


export const clearCartAfterOrder = async (req: Request, res: Response): Promise<any> => {
    try {

        const userId = req.user?._id

        const cart = await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } })

        return res.json("cart cleared after placing order")


    } catch (e: any) {
        console.log("error in clearCartAfterOrder", e.message)
        return res.json("Internal Server Error")
    }
}