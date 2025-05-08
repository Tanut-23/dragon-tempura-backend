import express from "express";
import { Product } from "../model/Product.js";

const router = express.Router();

//-----Add Product-----//
export const addProduct = async (req, res) => {
  try {
    const newProduct = new Product({ ...req.body, userId: req.user._id });
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error",
      detail: err.message,
    });
  }
};

//-----Get Product-----//
export const getProduct = async (req, res) => {
  try {
    const allProduct = await Product.find({'auction.isAuction': false});
    res.status(201).json({
      err: false,
      allProduct,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Fail to fetch",
      detail: err.message,
    });
  }
};

//-----Get Product By UserId-----//
export const getProductByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const product = await Product.find({ userId });
    //-----Validation-----//
    if (!product) {
      return res.status(404).json({
        err: true,
        message: "Can't find userId",
      });
    }
    res.status(200).json({
      error: false,
      product,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Fail to fetch by userId",
      detail: err.message,
    });
  }
};

export const editByPutProduct = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user._id;
  try {
    //-----Validation-----//
    const checkProductOwner = await Product.findOne({ _id: userId });
    if (!checkProductOwner) {
      return res.status(404).json({
        err: true,
        message: "You are not the owner",
      });
    }
    const existingProduct = await Product.findOne({ _id: productId });
    if (!existingProduct) {
      return res.status(404).json({
        error: true,
        message: "Product not found",
      });
    }
    //-----Update-----//
    const putProduct = await Product.findByIdAndUpdate(
      productId,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    res.status(200).json({
      error: false,
      putProduct,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Fail to fetch by productId",
      detail: err.message,
    });
  }
};

//-----Delete Product-----//

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        err: true,
        message: "Can't find productId",
      });
    }
    res.status(204).json({
      error: false,
      message: "Product is deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Fail to fetch product for delete.",
      detail: err.message,
    });
  }
};


//-----Get All Auction Product-----//
export const getAllAuctionProduct = async (req, res) => {
  try {
    const allAuctionProduct = await Product.find({'auction.isAuction': true});
    res.status(201).json({
      err: false,
      allAuctionProduct
    });
  } catch(err) {
    res.status(500).json({
      error: true,
      message: "Fail to fetch auction product",
      detail: err.message,
    });
  }
};


