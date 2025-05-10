import express from "express";
import { } from "../controller/productController.js";
import { authUser } from "./authMiddleware.js";
import { addCart, getCart } from "../controller/cartController.js";


const router = express.Router();

//Cart
router.post("/cart-add", authUser, addCart);
router.get("/cart-get", authUser, getCart);

export default router