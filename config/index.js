module.exports = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 3000,
  appName: process.env.APP_NAME || "PriceComparisonAPI",

  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  },

  priceApi: {
    key: process.env.PRICE_API_KEY,
    baseUrl: process.env.PRICE_API_BASE_URL,
  },
};
