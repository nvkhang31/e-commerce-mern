import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ success: false, message: "Account is inactive" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden: Admins only" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
  }
};