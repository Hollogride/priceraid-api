require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { requestLogger } = require("./middleware/logger.middleware");
const { errorHandler, notFoundHandler } = require("./middleware/error.middleware");
const { jsonOnly } = require("./middleware/jsonOnly.middleware");

const healthRoutes = require("./routes/health.routes");
const productRoutes = require("./routes/product.routes");
const priceRoutes = require("./routes/price.routes");
const storeRoutes = require("./routes/store.routes");

const logger = require("./config/logger");

const app = express();
const PORT = process.env.PORT || 3000;

// Security & parsing
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom middleware
app.use(jsonOnly);
app.use(requestLogger);

// Routes
app.use("/health", healthRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/prices", priceRoutes);
app.use("/api/v1/stores", storeRoutes);

// 404 & error handling — must be last
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`${process.env.APP_NAME} running on port ${PORT} [${process.env.NODE_ENV}]`);
});

module.exports = app;
