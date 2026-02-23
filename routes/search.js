const express = require("express");
const router = express.Router();
const { searchProducts } = require("../services/serpapi.service");

router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    if (!q) {
      return res.status(400).json({
        error: "Missing query. Use /search?q=iphone",
      });
    }

    const results = await searchProducts(q);

    return res.json({
      query: q,
      count: results.length,
      results,
    });
  } catch (err) {
    console.error("Search error:", err?.message || err);
    return res.status(500).json({
      error: "Search failed",
      details: err?.message || String(err),
    });
  }
});

module.exports = router;
