import express from "express";
import { addProduct, getProduct , getProductByUserId , deleteProduct} from "../controller/productController.js";
import {authUser} from "./authMiddleware.js";

const router = express.Router();

//Add product
router.post("/product-add", authUser ,addProduct)
router.get("/product-get", authUser , getProduct)
router.get("/product-get/:userId", authUser, getProductByUserId)
router.delete("/product-delete/:id", authUser , deleteProduct)

export default router