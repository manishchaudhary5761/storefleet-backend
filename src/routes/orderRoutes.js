import express from "express";
import { createOrderFromCart } from "../controllers/orderController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Place order using cart
router.post("/new", isAuthenticated, createOrderFromCart);

export default router;
