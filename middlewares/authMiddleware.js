import jwt from "jsonwebtoken";
import { User } from "../model/User.js";

export const authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error: true,
      message: "No token found",
    });
  }

  try {
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded_token.userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    req.user = user;  //add user data to req.user
    next();
  } catch (err) {
    const isExpired = err.name === "TokenExpiredError";
    return res.status(401).json({
      error: true,
      code: isExpired ? "Token expired" : "Invalid token",
      message: isExpired
        ? "Token has expired , please try again later"
        : "Invalid token",
    });
  }
};
