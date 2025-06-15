import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/categoryControllers.js";

const router = express.Router();

router.post("/add", adminMiddleware, upload.array("imageCategory", 5), createCategoryController);
router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);
router.put("/:id", adminMiddleware, upload.array("imageCategory", 5), updateCategoryController);
router.delete("/:id", adminMiddleware, deleteCategoryController);

export default router;