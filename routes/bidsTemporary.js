import express from "express";
import Bid from "../model/Bid.js";

const router = express.Router();

router.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const bids = await Bid.find({ productId }).sort({ time: -1 }); // เรียงจากล่าสุด
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
