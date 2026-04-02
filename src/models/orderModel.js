import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [
    {
      name: String,
      price: Number,
      quantity: Number,
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    },
  ],
  shippingInfo: {
    address: String,
    city: String,
    phoneNo: String,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    default: "Processing",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema);
