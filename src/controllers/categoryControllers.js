import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../services/categoryServices.js";

export const createCategoryController = async (req, res) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllCategoriesController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await getAllCategories(page, limit);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getCategoryByIdController = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    await deleteCategory(req.params.id);
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};