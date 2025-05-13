import express from "express";
import { Cart } from "../model/Cart.js";
import { Product } from "../model/Product.js";


const router = express.Router();

//-----Add Cart / Add item to Cart-----//
export const addCart = async (req, res) => {
  try {
    const userId = req.user._id; //From authUser (get user data from token)
    const newItem = req.body.items; //From frontend

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [newItem],
      });
    } else {
      //Check if the item already exists in the cart
      const exists = cart.items.some(
        (item) => item.productId.toString() === newItem.productId
      );

      if (exists) {
        return res.status(400).json({
          error: true,
          message: "Item already exists in the cart",
        });
      }

      cart.items.push(newItem);
      cart.updatedAt = new Date().getTime();
    }

    const saved = await cart.save();
    res.status(200).json(saved); //Respond with saved cart
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Can not add cart",
      detail: err.message,
    });
  }
};

//-----Get Cart for the user-----//
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId"
    );
    if (!cart) {
      res.status(404).json({
        error: false,
        message: "Can't find cart",
      });
    }
    res.status(200).json({
      error: false,
      cart,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Can not get cart",
      detail: err.message,
    });
  }
};

//-----Delete item in Cart/ Delete Cart when no item-----//
export const deleteCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({
        error: true,
        message: "Can not find cart",
      });
    }

    //Delete item in cart
    cart.items = cart.items.filter((item) => {
      return item.productId.toString() !== req.params.productId;
    });

    //Delete cart if no item
    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      return res.status(200).json({
        error: false,
        message: "Empty cart is deleted",
      });
    }

    //Otherwise save the updated cart
    const saved = await cart.save();

    res.status(200).json({
      error: false,
      saved,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Can not delete item in cart",
    });
  }
};

//-----Delete Cart After Order-----//
export const deleteCartAfterOrder = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId"
    );
    if (!cart) {
      return res.status(404).json({
        error: true,
        message: "Can not find cart",
      });
    }

    console.log("🛒 Found cart:", cart);
    // This is code that Mate try 😎

        // for (const item of cart.items) {
        //     if (item.productId) {
        //         await Product.findByIdAndUpdate(item.productId._id, { status: 'complete'});
        //     }
        // }
    for (const item of cart.items) {
      const product = item.productId;
      if (product && product.status !== "completed") {
        await Product.findByIdAndUpdate(item.productId._id, {
          status: "completed",
        });
      }
    }

    //Delete cart
    await Cart.findByIdAndDelete(cart._id);
    console.log("🗑️ Cart deleted");
    res.status(200).json({
      error: false,
      message: "Completed cart is deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Can not delete completed cart",
    });
  }
};
