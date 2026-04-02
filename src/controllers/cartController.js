import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

//Add product to cart
export const addToCart = async(req, res)=>{
    try{
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if(!product) return res.status(404).json({ success: false, message: "product not found"});

        let cart = await Cart.findOne({ user: req.user._id});

        if(!cart){
            cart = await Cart.create({
                user: req.user._id,
                cartItems: [{ product: productId, name: product.name, price: product.price, quantity }],
            });
        }else {
            const itemIndex = cart.cartItems.findIndex(item=> item.product.toString() === productId);
            if(itemIndex > -1){
                cart.cartItems.push({ product: productId, name: product.name, price: product.price, quantity});
            }
            await cart.save();
        }
        res.status(200).json({ success: true, cart });
    }catch(err){
        res.status(500).json({ success: false, error: error.message});
    }
};

// Get user's cart
export const getCart = async (req, res)=>{
    try{
        const cart = await Cart.findOne({ user: req.user._id}).populate("cartItems.product");
        if(!cart) return res.status(200).json({ success: true, cartItems: [] });
        res.status(200).json({ success: true, cartItems: cart.cartItems });
    }catch(err){
        res.status(500).json({ success: false, error: error.message });
    }
};

// Remove item from cart
export const removeFromCart = async(req, res)=>{
    try{
        const { productId } = req.body;
        let cart = await Cart.findOne({ user: req.user._id});
        if(!cart) return res.status(404).json({ success: false, message: "cart not found"});

        cart.cartItems = cart.cartItems.filter(item=> item.product.toString() !== productId);
        await cart.save();

        res.status(200).json({ success: true, cart });
    }catch(err){
        res.status(500).json({ success: false, error: error.message });
    }
};