// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    // ✅ Use JWT_TOKEN instead of JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    // ✅ Use decoded.userid instead of decoded.id
    req.user = await User.findById(decoded.userid).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};