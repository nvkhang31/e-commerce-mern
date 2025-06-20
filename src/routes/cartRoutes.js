import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware(["customer", "seller", "admin"]), addToCart);
router.get("/", authMiddleware(["customer", "seller", "admin"]), getCart);
router.put(
  "/update",
  authMiddleware(["customer", "seller", "admin"]),
  updateCartItem
);
router.delete(
  "/remove",
  authMiddleware(["customer", "seller", "admin"]),
  removeCartItem
);

export default router;
