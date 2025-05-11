import { Server } from 'socket.io';

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: { origin: 'http://localhost:5173' },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('oneBid', (dataAuctioneer) => {
      io.emit('shareBid', dataAuctioneer);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
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