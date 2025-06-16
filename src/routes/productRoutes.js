import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from "../controllers/productControllers.js";

const router = express.Router();

// Seller only
router.post("/add", authMiddleware(["seller"]), upload.array("imagesProduct", 5), createProductController);
router.put("/:id", authMiddleware(["seller"]), upload.array("imagesProduct", 5), updateProductController);
router.delete("/:id", authMiddleware(["seller"]), deleteProductController);

// Public
router.get("/", getAllProductsController);
router.get("/:id", getProductByIdController);

export default router;