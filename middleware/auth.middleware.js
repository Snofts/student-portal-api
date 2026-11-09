import jwt from "jsonwebtoken";

import User from "../model/userModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
    // [Bearer, eyJhbGciOiJIUzI1NiIs...]

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check whether token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login.",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded token:", decoded.id);

    // Find authenticated user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is no longer authorized",
      });
    }

    // Attach user to request
    req.user = user;

    // Continue to next middleware
    next();

  } catch (error) {

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    next(error);
  }
};