// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT token before protected routes
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      req.user = decoded;
      next();
    });
  } catch (err) {
    res.status(500).json({ message: "Server error verifying token" });
  }
};
