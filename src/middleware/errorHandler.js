/**
 * Centralized error-handling middleware.
 * Express recognises it by the 4-parameter signature (err, req, res, next).
 */
const errorHandler = (err, _req, res, _next) => {
  console.error("❌ Error:", err.message || err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
