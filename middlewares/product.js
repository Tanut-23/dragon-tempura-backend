import express from "express";
import { addProduct, getProduct , getProductByUserId , editByPutProduct , deleteProduct, getAllAuctionProduct} from "../controller/productController.js";
import {authUser} from "./authMiddleware.js";

const router = express.Router();

//Add product
router.post("/product-add", authUser ,addProduct)
router.get("/product-get", authUser , getProduct)
router.get("/product-get/:userId", authUser, getProductByUserId)
router.put("/product-put/:id", authUser , editByPutProduct)
router.delete("/product-delete/:id", authUser , deleteProduct)

//Get all auction product
router.get("/product-get-auction", authUser, getAllAuctionProduct);


export default router