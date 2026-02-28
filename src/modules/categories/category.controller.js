const Category = require("./category.model");

const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (_req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.softDeleteById(req.params.id);

    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const restoreCategory = async (req, res, next) => {
  try {
    const category = await Category.restore(req.params.id);

    if (!category) {
      const error = new Error("Category not found or not deleted");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};
const getDeletedCategories = async (_req, res, next) => {
  try {
    const categories = await Category.findDeleted().sort({ deletedAt: -1 });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
};
module.exports = { createCategory, getAllCategories, getDeletedCategories, deleteCategory, restoreCategory };
