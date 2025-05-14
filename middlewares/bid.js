import express from 'express';
import { getBidsByProduct } from '../controller/bidController.js';


const router = express.Router();

router.get('/bids/:productId', getBidsByProduct);


export default router;
