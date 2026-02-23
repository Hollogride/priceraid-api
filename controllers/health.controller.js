const os = require("os");
const config = require("../config");

const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
      app: config.appName,
      version: process.env.npm_package_version || "1.0.0",
      environment: config.env,
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
      system: {
        platform: os.platform(),
        nodeVersion: process.version,
        memoryUsage: {
          heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
        },
      },
    },
  });
};

const getReadiness = (req, res) => {
  // Extend this to check DB connection, external APIs, etc.
  const checks = {
    server: true,
    // database: checkDb(),
  };

  const allReady = Object.values(checks).every(Boolean);

  res.status(allReady ? 200 : 503).json({
    success: allReady,
    data: {
      status: allReady ? "ready" : "not ready",
      checks,
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = { getHealth, getReadiness };
