const express = require("express");
const router = express.Router();
const {
  getPricesForProduct,
  getLowestPrice,
  comparePrices,
  getPriceHistory,
} = require("../controllers/price.controller");

router.get("/product/:productId", getPricesForProduct);
router.get("/product/:productId/lowest", getLowestPrice);
router.get("/compare", comparePrices);
router.get("/product/:productId/history", getPriceHistory);

module.exports = router;
