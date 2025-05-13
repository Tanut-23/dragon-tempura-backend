import { Server } from 'socket.io';
import { Bid } from './model/Bid.js';
import { Product } from './model/Product.js'


let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: { origin: ['https://dragon-tempura-sprint2.vercel.app', 'http://localhost:5173',] },
  });

  io.on('connection', (socket) => {
    socket.on('placeBid', async ({ productId, userId, amount }) => {
      console.log('placeBid received:', { productId, userId, amount });
      if (!productId || !userId || !amount) {
        socket.emit('bidError', { message: 'Missing productId, userId, or amount' });
        return;
      }
      try {
        const product = await Product.findById(productId).populate('currentBid');
        if (product.currentBid && amount <= product.currentBid.amount) {
          socket.emit('bidError', { message: 'Bid must be higher than current bid' });
          return;
        }

        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: productId,
            $or: [
              { currentBid: null },
              { 'currentBid.amount': { $lt: amount } }
            ]
          },
          { $set: {} },
          { new: true }
        ).populate('currentBid');

        if (!updatedProduct) {
          socket.emit('bidError', { message: 'Bid was too slow or not high enough' });
          return;
        }

        const newBid = await Bid.create({
          product: productId,
          user: userId,
          amount
        });

        await Product.findByIdAndUpdate(productId, { currentBid: newBid._id });

        const populatedBid = await Bid.findById(newBid._id).populate('user', 'firstName lastName');
        io.emit('newBid', {
          productId,
          amount,
          userId,
          createdAt: newBid.createdAt,
          firstName: populatedBid.user?.firstName || "Unknown",
          lastName: populatedBid.user?.lastName || ""
        });
      } catch (err) {
        console.error('Bid creation error:', err);
        socket.emit('bidError', { message: 'Bid creation failed', detail: err.message });
      }
    });
  });

  return io;
};

export { initializeSocket, io };


// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import router from "./routes/route.js";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import { Server } from 'socket.io';
// import http from 'http';

// dotenv.config();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: 'http://localhost:5173', },
// });

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));
// app.use(cookieParser());

// app.use(express.json());

// const port = process.env.PORT;

// (async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("Connected to Mongo database");
//   } catch (err) {
//     console.error(`MongoDB connection error: ${err}`)
//     process.exit(1);
//   }
// })();

// // Socket
// io.on('connection', (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   socket.on('oneBid', (dataAuctioneer) => {
//     io.emit('shareBid', dataAuctioneer);
//   });

//   socket.on('disconnect', () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });

// app.use("", router);

// server.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });