import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    orderStatus: {
        type: String,
        enum: ["recieved", "delivered" , "shipped" , "cancelled"]
    },
    totalOrderValue: {
        type: Number,
    },
    paymentStatus : {
        type : String,
        enum : ["paid" , "pending"  , "failed"],
        default : "pending"
    }
}, { timestamps: true })

export const Order = mongoose.model("Order", orderSchema)