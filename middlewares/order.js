import express from "express";
import { } from "../controller/productController.js";
import {authUser} from "./authMiddleware.js";
import { addOrder } from "../controller/orderController.js";

const router = express.Router();

//Order
router.post("/order-add", authUser, addOrder);


export default router


