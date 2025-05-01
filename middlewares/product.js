import express from "express";

const router = express.Router();

//Add product
router.post("/product-add", addProduct)