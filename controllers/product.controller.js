const productService = require("../services/product.service");
const { AppError } = require("../middleware/error.middleware");

const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const products = await productService.findAll({ page: +page, limit: +limit, category });
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.findById(req.params.id);
    if (!product) throw new AppError("Product not found", 404);
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) throw new AppError("Search query 'q' is required", 400);
    const results = await productService.search(q);
    res.status(200).json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    if (!product) throw new AppError("Product not found", 404);
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productService.remove(req.params.id);
    res.status(200).json({ success: true, data: { message: "Product deleted successfully" } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllProducts, getProductById, searchProducts, createProduct, updateProduct, deleteProduct };
