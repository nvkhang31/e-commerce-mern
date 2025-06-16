import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/productServices.js";

export const createProductController = async (req, res) => {
  try {
    let data = req.body;
    if (req.files && req.files.length > 0) {
      data.imagesProduct = req.files.map(file => file.path);
    }
    data.sellerId = req.user._id;
    const product = await createProduct(data);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllProductsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await getAllProducts(page, limit);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateProductController = async (req, res) => {
  try {
    let data = req.body;
    if (req.files && req.files.length > 0) {
      data.imagesProduct = req.files.map(file => file.path);
    }
    const product = await updateProduct(req.params.id, data, req.user._id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await deleteProduct(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};