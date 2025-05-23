import express from "express";
import user from "../middlewares/user.js";
import product from "../middlewares/product.js";
import order from "../middlewares/order.js";
import cart from "../middlewares/cart.js";
import bid from "../middlewares/bid.js";

const router = express.Router();

router.use("/api", user);
router.use("/api", product);
router.use("/api", order);
router.use("/api", cart);
router.use("/api", bid);

export default router;
