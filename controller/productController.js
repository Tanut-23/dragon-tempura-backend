import express from "express";
import { Product } from "../model/Product.js";

const router = express.Router();

//-----Add Product-----//
export const addProduct =  async (req, res) => {
  try {
    const newProduct = new Product(req.body);
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