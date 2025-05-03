import express from "express";
import { Product } from "../model/Product.js";

const router = express.Router();

//-----Add Product-----//
export const addProduct =  async (req, res) => {
  try {
    const newProduct = new Product({...req.body, userId: req.user._id});
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
 try{
  const allProduct = await Product.find();
  res.status(201).json({
    err: false,
   allProduct,
  })
 } catch (err) {
  res.status(500).json({
    error: true,
    message: "Fail to fetch",
    detail: err.message,
  })
 }
};

//-----Get Product By UserId-----//
export const getProductByUserId = async (req, res)=> {
  try{
    const product = await Product.find({userId: req.params.userId})
    if (!product) {
      return res.status(404).json({
        err: true,
        message: "Can't find userId",
      })
    }
    res.status(200).json({
      error: false,
      product
    })
  } catch(err){
    res.status(500).json({
      error: true,
      message: "Fail to fetch by userId",
      detail: err.message
    })
  }
}

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try{
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        err : true,
        message : "Can't find productId",
      })
    }
    res.status(204).json({
      error:false,
      message: "Product is deleted",
    });
  } catch(err){
    res.status(500).json({
      error: true,
      message: "Fail to fetch product for delete.",
      detail: err.message
    }
    )
  }
}






















// import { Product } from "../model/Product.js";


// export const addProduct = async (res,req) => {
    
//     try {
//         const newProduct = new Product(req.body);
//         const save = newProduct.save();
//         res.status(201).json(save);
        
//     } catch (err) {
//         res.status(500).json({
//             error: true,
//             message: "Server error",
//             detail: err.message,
//         });
//     }
// }
// const { title , description ,  artist , image  , sellerName , dimensions , material , yearCreated , tags , price , status } = req.body;