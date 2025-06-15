import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../services/categoryServices.js";

export const createCategoryController = async (req, res) => {
  try {
    let data = req.body;
    if (req.files && req.files.length > 0) {
      data.imageCategory = req.files.map(file => file.path);
    }
    const category = await createCategory(data);
    res.status(201).json({ success: true, category });
  } catch (error) {
     console.error("CATEGORY ERROR:", error, error.message, error.stack);
    // Sửa lại dòng này:
    res.status(400).json({ success: false, message: error.message || String(error) });
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
    let data = req.body;
    if (req.files && req.files.length > 0) {
      data.imageCategory = req.files.map(file => file.path);
    }
    const category = await updateCategory(req.params.id, data);
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