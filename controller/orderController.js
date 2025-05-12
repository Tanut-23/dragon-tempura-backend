import express from "express";
import { Order } from "../model/Order.js";

const router = express.Router();

//-----Add Order-----//
export const addOrder = async (req, res) => {
    try {
        const newOrder55 = new Order({ ...req.body, userId: req.user._id });
        const saved = await newOrder55.save();
        res.status(201).json(saved);
    } catch(err) {
        res.status(500).json({
            error: true,
            message: "Can not post order",
            detail: err.message,
        })
    }
};

//-----Get Order-----//
export const getOrder = async (req, res) => {
    try {
        const orderHistory = await Order.find({userId: req.user._id}).populate("productId");
        if (!orderHistory) {
            res.status(404).json({
                error: false,
                message: "Can't find order"
            })
        }
        res.status(200).json({
            error: false,
            orderHistory,
        })
    } catch(err) {
        res.status(500).json({
            error: true,
            message: "Can not get order",
            detail: err.message,
        })
    }
}

