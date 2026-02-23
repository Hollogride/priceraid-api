const axios = require("axios");

const SERPAPI_ENDPOINT = "https://serpapi.com/search.json";

/**
 * Returns a normalized list of products from SerpApi (Google Shopping).
 * Each item: { title, price, currency, store, url, image }
 */
async function searchProducts(query) {
  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    throw new Error("Missing SERPAPI_KEY in environment variables");
  }
  if (!query || !query.trim()) {
    return [];
  }

  const params = {
    engine: "google_shopping",
    q: query,
    api_key: apiKey,
    // optional: hl/gl can improve results
    hl: "en",
    gl: "us",
  };

  const { data } = await axios.get(SERPAPI_ENDPOINT, { params });

  // SerpApi returns results in different keys depending on engine/response
  const raw =
    data?.shopping_results ||
    data?.organic_results || // fallback, sometimes present
    [];

  // Normalize
  const results = raw
    .map((r) => {
      const title = r.title || r.name || null;

      // Common fields from google_shopping engine
      const store = r.source || r.seller || r.store || null;
      const url = r.link || r.product_link || r.redirect_link || null;
      const image =
        r.thumbnail || r.thumbnail_url || r.image || r.image_url || null;

      // Price can come as:
      // - extracted_price (number)
      // - price (string like "$399")
      // - extracted_price + currency
      const extracted = r.extracted_price;
      const priceString = r.price;

      let price = null;
      let currency = null;

      if (typeof extracted === "number") {
        price = extracted;
        currency = r.currency || "USD";
      } else if (typeof priceString === "string") {
        // very simple parse, like "$399.99"
        const m = priceString.replace(/,/g, "").match(/([£$€])\s?(\d+(\.\d+)?)/);
        if (m) {
          currency = m[1] === "$" ? "USD" : m[1] === "€" ? "EUR" : "GBP";
          price = Number(m[2]);
        }
      }

      if (!title || !url) return null;

      return {
        title,
        price,
        currency,
        store,
        url,
        image,
      };
    })
    .filter(Boolean);

  return results;
}

module.exports = { searchProducts };
