/**
 * Price Service
 * Replace in-memory store with your DB layer or external pricing API.
 */

const prices = [
  { id: "p1", productId: "1", storeId: "s1", storeName: "BestBuy", price: 999.99, currency: "USD", url: "https://bestbuy.com/iphone15pro", inStock: true, fetchedAt: new Date().toISOString() },
  { id: "p2", productId: "1", storeId: "s2", storeName: "Amazon", price: 979.00, currency: "USD", url: "https://amazon.com/iphone15pro", inStock: true, fetchedAt: new Date().toISOString() },
  { id: "p3", productId: "2", storeId: "s1", storeName: "BestBuy", price: 849.99, currency: "USD", url: "https://bestbuy.com/galaxys24", inStock: true, fetchedAt: new Date().toISOString() },
  { id: "p4", productId: "2", storeId: "s2", storeName: "Amazon", price: 829.99, currency: "USD", url: "https://amazon.com/galaxys24", inStock: false, fetchedAt: new Date().toISOString() },
  { id: "p5", productId: "3", storeId: "s3", storeName: "Walmart", price: 279.00, currency: "USD", url: "https://walmart.com/sony-wh1000xm5", inStock: true, fetchedAt: new Date().toISOString() },
];

const getPricesByProductId = async (productId) => {
  return prices.filter((p) => p.productId === productId);
};

const findLowest = async (productId) => {
  const productPrices = prices.filter((p) => p.productId === productId && p.inStock);
  if (!productPrices.length) return null;
  return productPrices.reduce((min, p) => (p.price < min.price ? p : min));
};

const compare = async (productIds) => {
  return productIds.map((productId) => {
    const productPrices = prices.filter((p) => p.productId === productId);
    const lowest = productPrices.filter((p) => p.inStock).reduce((min, p) => (!min || p.price < min.price ? p : min), null);
    return { productId, prices: productPrices, lowestPrice: lowest };
  });
};

const getHistory = async (productId, days = 30) => {
  // Stub: return current prices with simulated date range note
  // In production, query a price_history table filtered by date range
  const since = new Date();
  since.setDate(since.getDate() - days);
  return {
    productId,
    since: since.toISOString(),
    until: new Date().toISOString(),
    history: prices.filter((p) => p.productId === productId),
  };
};

module.exports = { getPricesByProductId, findLowest, compare, getHistory };
