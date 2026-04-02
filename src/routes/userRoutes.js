import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
} from "../controllers/userController.js";
import { isAuthenticated, authByUserRole } from "../middleware/auth.js";
import { updateUserRole } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.put("/reset/:token", resetPassword);
router.put("/admin/update/:id", isAuthenticated, authByUserRole("admin"), updateUserRole);
// 🔥 Protected route
router.get("/profile", isAuthenticated, getProfile);


export default router;
