const jwt = require("jsonwebtoken");

const requireAuth = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Unauthorized — token missing");
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      error.message = "Unauthorized — invalid or expired token";
      error.statusCode = 401;
    }
    next(error);
  }
};

module.exports = requireAuth;
