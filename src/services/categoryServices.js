import Category from "../models/category.js";

export const createCategory = async (data) => {
  const { name, description, imageCategory } = data;
  if (!name) throw new Error("Category name is required");
  const exists = await Category.findOne({ name });
  if (exists) throw new Error("Category already exists");
  const category = new Category({ name, description, imageCategory });
  await category.save();
  return category;
};

export const getAllCategories = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [categories, total] = await Promise.all([
    Category.find().skip(skip).limit(limit),
    Category.countDocuments()
  ]);
  return {
    categories,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

export const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new Error("Category not found");
  return category;
};

export const updateCategory = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, { new: true });
  if (!category) throw new Error("Category not found");
  return category;
};

export const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new Error("Category not found");
  return category;
};