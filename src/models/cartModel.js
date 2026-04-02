import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    cartItems: [
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                requires: true,
            },
            name: String,
            price: Number,
            quantity: { type: Number, default: 1},
        },
    ],
});

export default mongoose.model("Cart", cartSchema);