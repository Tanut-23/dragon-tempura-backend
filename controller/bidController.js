import { Bid } from '../model/Bid.js';

export const getBidsByProduct = async (req, res) => {
  try {
    const bids = await Bid.find({ product: req.params.productId })
      .sort({ createdAt: -1 })
      .populate('user', 'firstName lastName');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get bids' });
  }
};