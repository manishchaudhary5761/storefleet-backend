import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";

// Create Order from Cart
export const createOrderFromCart = async (req, res) => {
  try {
    // 1️⃣ Get user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // 2️⃣ Calculate total price
    const totalPrice = cart.cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    // 3️⃣ Create Order
    const order = await Order.create({
      user: req.user._id,
      orderItems: cart.cartItems.map((item) => ({
        product: item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      shippingInfo: req.body.shippingInfo,
      totalPrice,
      orderStatus: "Processing",
    });

    // 4️⃣ Clear user's cart
    cart.cartItems = [];
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
