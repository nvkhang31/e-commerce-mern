import Product from "../models/product.js";

export const createProduct = async (data) => {
  const { name, description, price, imagesProduct, categoryId, stock, sellerId } = data;
  if (!name || !price || !categoryId || !imagesProduct || !sellerId) throw new Error("Missing required fields");
  const product = new Product({ name, description, price, imagesProduct, categoryId, stock, sellerId });
  await product.save();
  return product;
};

export const getAllProducts = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    Product.find().skip(skip).limit(limit),
    Product.countDocuments()
  ]);
  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");
  return product;
};

export const updateProduct = async (id, data, sellerId) => {
  const product = await Product.findOneAndUpdate(
    { _id: id, sellerId },
    data,
    { new: true }
  );
  if (!product) throw new Error("Product not found or not owned by seller");
  return product;
};

export const deleteProduct = async (id, sellerId) => {
  const product = await Product.findOneAndDelete({ _id: id, sellerId });
  if (!product) throw new Error("Product not found or not owned by seller");
  return product;
};