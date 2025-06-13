import express from "express";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/categoryControllers.js";

const router = express.Router();

router.post("/add", adminMiddleware, createCategoryController);
router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);
router.put("/:id", adminMiddleware, updateCategoryController);
router.delete("/:id", adminMiddleware, deleteCategoryController);

export default router;