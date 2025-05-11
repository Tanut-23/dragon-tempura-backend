import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from 'http';
import { initializeSocket } from './socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

initializeSocket(server);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());

app.use(express.json());

const port = process.env.PORT;

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Mongo database");
  } catch (err) {
    console.error(`MongoDB connection error: ${err}`)
    process.exit(1);
  }
})();

app.use("", router);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});