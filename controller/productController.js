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

//-----Get Fixed Price Product-----//
export const getProduct = async (req, res) => {
  try {
    const allProduct = await Product.find({'auction.isAuction': false , 'approve': 'approved' ,
      'status': 'onGoing'});
    res.status(200).json({
      err: false,
      allProduct,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Fail to fetch fixed price product",
      detail: err.message,
    });
  }
};
//-----Get My Product-----//
export const getMyProduct = async (req, res) => {
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
}

//-----Get Product By Genre-----//
// export const getProductByGenre = async (req, res) => {
//   const genre = req.query.genre;

//   try {
//     const query = genre ? { "tags.title": genre } : {};
//     query["approve"] = "approved";
//     query["auction.isAuction"] = { $ne: true };

//     const products = await Product.find(query)
//     res.status(200).json({
//       error: false,
//       products,
//     });
// } catch (err) {
//     res.status(500).json({
//       error: true,
//       message: "Failed to fetch products",
//       detail: err.message,
//     });
//   }
// }

//-----Get Product By productId-----//
export const getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId)
    if(!product) {
      return res.status(404).json({
        err: true,
        message: "Can't find productId",
      })
    }
    res.status(200).json({
      error: false,
      product,
    })
  } catch(err){
    res.status(500).json({
      error: true,
      message: "Failed to fetch product",
      detail: err.message,
    })
  }
}
//-----Get Product By productId-----//
export const getOnceProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId)
    if(!product) {
      return res.status(404).json({
        err: true,
        message: "Can't find productId",
      })
    }
    res.status(200).json({
      error: false,
      product,
    })
  } catch(err){
    res.status(500).json({
      error: true,
      message: "Failed to fetch product",
      detail: err.message,
    })
  }
}

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


//-----Edit Product-----//
export const editByPutProduct = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user._id;
  try {
    const product = await Product.findById(productId);
    //-----Validation-----//
    if(product.userId.toString() !== userId.toString()){
      return res.status(403).json({
        error: true,
        message: "You are not the owner",
      })
    }
    
    if (!product) {
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
    const allAuctionProduct = await Product.find({'auction.isAuction': true, 'approve': 'approved' , 'status': 'onGoing'});
    res.status(200).json({
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
//-----Get All Auction Product By productId-----//
export const getAllAuctionProductId = async (req, res) => {
  try {
    const { id } = req.params;
    const auctionProduct = await Product.findOne({
      _id: id,
      'auction.isAuction': true,
      'status': 'onGoing',});
      if(!auctionProduct) {
        return res.status(404).json({
          err: true,
          message: "Can't find auction productId",
        });
      }
      res.status(200).json({
      err: false,
      auctionProduct
    });
  } catch(err) {
    res.status(500).json({
      error: true,
      message: "Fail to fetch auction product",
      detail: err.message,
    });
  }
};


