const priceService = require("../services/price.service");
const { AppError } = require("../middleware/error.middleware");

const getPricesForProduct = async (req, res, next) => {
  try {
    const prices = await priceService.getPricesByProductId(req.params.productId);
    res.status(200).json({ success: true, data: prices });
  } catch (err) {
    next(err);
  }
};

const getLowestPrice = async (req, res, next) => {
  try {
    const lowest = await priceService.findLowest(req.params.productId);
    if (!lowest) throw new AppError("No prices found for this product", 404);
    res.status(200).json({ success: true, data: lowest });
  } catch (err) {
    next(err);
  }
};

const comparePrices = async (req, res, next) => {
  try {
    const { productIds } = req.query;
    if (!productIds) throw new AppError("'productIds' query param is required (comma-separated)", 400);
    const ids = productIds.split(",").map((id) => id.trim());
    const comparison = await priceService.compare(ids);
    res.status(200).json({ success: true, data: comparison });
  } catch (err) {
    next(err);
  }
};

const getPriceHistory = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const history = await priceService.getHistory(req.params.productId, +days);
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPricesForProduct, getLowestPrice, comparePrices, getPriceHistory };
