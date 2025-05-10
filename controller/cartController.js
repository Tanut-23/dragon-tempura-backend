import express from "express";
import { Cart } from "../model/Cart.js"

const router = express.Router();

//-----Add Cart / Add item to Cart-----//
export const addCart = async (req, res) => {
    try {
        const userId = req.user._id;        //From authUser (get user data from token)
        const newItem = req.body.items;     //From frontend

        let cart = await Cart.findOne({userId: req.user._id})
        if (!cart) {
            cart = new Cart({
                userId,
                items: [newItem]
            })
        } else {
            //Check if the item already exists in the cart
            const exists = cart.items.some(
                item => item.productId.toString() === newItem.productId
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
        res.status(200).json(saved)         //Respond with saved cart

    } catch(err) {
        res.status(500).json({
            error: true,
            message: "Can not add cart",
            detail: err.message,
        })
    }
};




//-----Get Cart for the user-----//
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({userId: req.user._id});
        if (!cart) {
            res.status(404).json({
                error: false,
                message: "Can't find "
            })
        }
        res.status(200).json({
            error: false,
            cart
        })
    } catch(err) {
        res.status(500).json({
            error: true,
            message: "Can not get cart",
            detail: err.message,
        })
    }
}
