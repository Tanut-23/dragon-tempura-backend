import express from "express";
import { Order } from "../model/Order.js";

const router = express.Router();

//-----Add Order-----//
export const addOrder = async () => {
    try {
        const newOrder = new Order({ ...req.body, userId: req.user._id });
        const saved = await newOrder.save();
        res.status(201).json(saved);
    } catch(err) {
        res.status(500).json({
            error: true,
            message: "Can not post order",
            detail: err.message,
        })
    }
};
