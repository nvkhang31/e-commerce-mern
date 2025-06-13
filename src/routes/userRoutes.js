import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getProfileController,
  updateProfileController,
  changePasswordController,
} from "../controllers/userControllers.js";

const router = express.Router();

// Chỉ user đã đăng nhập mới được thao tác profile
router.get("/profile", authMiddleware(["customer", "seller", "admin"]), getProfileController);
router.put("/edit-profile", authMiddleware(["customer", "seller", "admin"]), updateProfileController);
router.put("/change-password", authMiddleware(["customer", "seller", "admin"]), changePasswordController);

export default router;