import express from "express";
import {
  addProduct,
  getProduct,
  getProductByUserId,
  editByPutProduct,
  deleteProduct,
  getAllAuctionProduct,
  getProductById,
  getOnceProductById,
  getProductByGenre,
  getMyProduct,
} from "../controller/productController.js";

import { authUser } from "./authMiddleware.js";
import { Product } from "../model/Product.js";

const router = express.Router();

//Add product
router.post("/product-add", authUser, addProduct);
router.get("/product-get", getProduct);
router.get("/product/:id", getOnceProductById);
router.get("/product-get/:id", authUser, getProductById);
router.get("/product-get/:userId", authUser, getProductByUserId);
router.put("/product-put/:id", authUser, editByPutProduct);
router.delete("/product-delete/:id", authUser, deleteProduct);

//Get all auction product
router.get("/product-get-auction",  getAllAuctionProduct);

//Get product by genre
router.get("/products", getProductByGenre);

router.get("/my-products", authUser, getMyProduct);

export default router;
