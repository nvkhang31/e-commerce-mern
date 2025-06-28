import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware(["customer", "seller"]), addToCart);
router.get("/", authMiddleware(["customer", "seller"]), getCart);
router.put(
  "/update",
  authMiddleware(["customer", "seller"]),
  updateCartItem
);
router.delete(
  "/remove",
  authMiddleware(["customer", "seller"]),
  removeCartItem
);

export default router;
