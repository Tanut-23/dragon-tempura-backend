import express from "express";
import { } from "../controller/productController.js";
import { authUser } from "./authMiddleware.js";
import { addCart, deleteCart, deleteCartAfterOrder, getCart } from "../controller/cartController.js";


const router = express.Router();

//Cart
router.post("/cart-add", authUser, addCart);
router.get("/cart-get", authUser, getCart);
router.delete("/cart-delete/:productId", authUser, deleteCart);
router.delete("/cart-delete", authUser, deleteCartAfterOrder);

export default router