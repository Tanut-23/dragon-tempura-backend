import express from "express";
import { addProduct } from "../controller/productController.js";

const router = express.Router();

//Add product
router.post("/product-add", addProduct)

export default router