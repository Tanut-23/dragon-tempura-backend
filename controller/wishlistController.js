import { User } from "../model/User.js";
import { Product } from "../model/Product.js";

//-----Add to Wishlist-----//
export const addWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const newItem = req.body.items;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    const exists = user.wishlists.some(
      (item) => item.productId.toString() === newItem.productId
    );

    if (exists) {
      return res.status(400).json({
        error: true,
        message: "Item already exists in wishlist",
      });
    }

    user.wishlists.push(newItem);
    const saved = await user.save();

    res.status(200).json({
      error: false,
      user: { wishlist: saved.wishlists }
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Cannot add to wishlist",
      detail: err.message,
    });
  }
};

//-----Get Wishlist-----//
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("wishlists.productId");
    
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    res.status(200).json({
      error: false,
      user: { wishlist: user.wishlists }
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Cannot get wishlist",
      detail: err.message,
    });
  }
};

//-----Delete from Wishlist-----//
export const deleteWishlist = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    user.wishlists = user.wishlists.filter(
      (item) => item.productId.toString() !== req.params.productId
    );

    const saved = await user.save();

    res.status(200).json({
      error: false,
      user: { wishlist: saved.wishlists }
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Cannot delete from wishlist",
      detail: err.message,
    });
  }
};