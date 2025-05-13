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
} from "../controller/productController.js";

import { authUser } from "./authMiddleware.js";
import { Product } from "../model/Product.js";

const router = express.Router();

//Add product
router.post("/product-add", authUser, addProduct);
router.get("/product-get", authUser, getProduct);
router.get("/product/:id", getOnceProductById);
router.get("/product-get/:id", authUser, getProductById);
router.get("/product-get/:userId", authUser, getProductByUserId);
router.put("/product-put/:id", authUser, editByPutProduct);
router.delete("/product-delete/:id", authUser, deleteProduct);

//Get all auction product
router.get("/product-get-auction", authUser, getAllAuctionProduct);

//Get product by genre
router.get("/products", async (req, res) => {
  const genre = req.query.genre;

  try {
    const query = genre ? { "tags.title": genre } : {};

    const products = await Product.find(query)
    res.status(200).json({
      error: false,
      products,
    });
} catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch products",
      detail: err.message,
    });
  }
});

router.get("/my-products", authUser, async (req, res) => {
  const { _id } = req.user;
  try {
    const products = await Product.find({ userId: _id });
    if (!products) {
      return res
        .status(404)
        .json({ error: true, message: "Product not found" });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch products",
      detail: err.message,
    });
  }
});

export default router;
