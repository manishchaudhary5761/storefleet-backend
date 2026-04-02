import express from "express";
import {
  createProduct,
  getAllProducts,
  deleteReview,
} from "../controllers/productController.js";
import { authByUserRole, isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/new", isAuthenticated, authByUserRole("admin"), createProduct);

// 🔍 search + pagination
router.get("/", getAllProducts);

// ⭐ delete review
router.delete("/review",isAuthenticated, deleteReview);

export default router;
