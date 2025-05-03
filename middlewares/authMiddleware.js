import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({
      error: true,
      message: "No access try again later.",
    });
  }

  try {
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {_id : decoded_token.userId}
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
