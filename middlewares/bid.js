// routes/bidRoutes.js
import express from 'express';
import { getBidsByProduct } from '../controller/bidController.js';

const router = express.Router();

// /api/bids/:productId
router.get('/:productId', getBidsByProduct);

export default router;
