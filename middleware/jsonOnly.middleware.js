const jsonOnly = (req, res, next) => {
  // Force all responses to be JSON
  res.setHeader("Content-Type", "application/json");

  // Reject non-JSON bodies on POST/PUT/PATCH
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    const contentType = req.headers["content-type"] || "";
    if (req.body && Object.keys(req.body).length > 0 && !contentType.includes("application/json")) {
      return res.status(415).json({
        success: false,
        error: { message: "Content-Type must be application/json" },
      });
    }
  }

  next();
};

module.exports = { jsonOnly };
