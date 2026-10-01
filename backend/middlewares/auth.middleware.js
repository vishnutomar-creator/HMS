const {
  verifyToken,
} = require("../utils/jwt");

const authMiddleware = (
  req,
  res,
  next
) => {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.hms_session;

    if (!authHeader && !cookieToken) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required",
      });
    }

    const bearerToken = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    const token = bearerToken || cookieToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    const decoded =
      verifyToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
