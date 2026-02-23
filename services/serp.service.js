const axios = require("axios");
const { AppError } = require("../middleware/error.middleware");

const SERPAPI_BASE_URL = "https://serpapi.com/search.json";
const SERPAPI_KEY = process.env.SERPAPI_KEY;

/**
 * Search Google Shopping results via SerpApi.
 * @param {string} query - Product search term
 * @returns {Promise<Array>} Normalized array of shopping results
 */
const searchProducts = async (query) => {
  if (!SERPAPI_KEY) {
    throw new AppError("SERPAPI_KEY environment variable is not set", 500);
  }

  if (!query || !query.trim()) {
    throw new AppError("Search query must not be empty", 400);
  }

  let response;

  try {
    response = await axios.get(SERPAPI_BASE_URL, {
      params: {
        engine: "google_shopping",
        q: query.trim(),
        api_key: SERPAPI_KEY,
        hl: "en",
        gl: "us",
      },
      timeout: 10_000,
    });
  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      const message = err.response.data?.error || "SerpApi request failed";

      if (status === 401) throw new AppError("Invalid SerpApi API key", 401);
      if (status === 429) throw new AppError("SerpApi rate limit exceeded", 429);

      throw new AppError(`SerpApi error (${status}): ${message}`, 502);
    }

    if (err.code === "ECONNABORTED") {
      throw new AppError("SerpApi request timed out", 504);
    }

    throw new AppError(`Failed to reach SerpApi: ${err.message}`, 502);
  }

  const rawResults = response.data?.shopping_results ?? [];

  if (!rawResults.length) {
    return [];
  }

  return rawResults.map((item) => ({
    title: item.title ?? null,
    price: item.price ?? null,
    link: item.link ?? null,
    image: item.thumbnail ?? null,
    store: item.source ?? null,
  }));
};

module.exports = { searchProducts };