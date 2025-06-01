import express from "express";
import { authUser } from "./authMiddleware.js";
import {
  addWishlist,
  getWishlist,
  deleteWishlist,
} from "../controller/wishlistController.js";

const router = express.Router();

// Wishlist routes
router.post("/wishlist-add", authUser, addWishlist);
router.get("/wishlist-get", authUser, getWishlist);
router.delete("/wishlist-delete/:productId", authUser, deleteWishlist);

export default router;