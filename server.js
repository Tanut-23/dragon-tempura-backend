import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import router from "./routes/route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from 'http';
import { initializeSocket } from './socket.js';

dotenv.config();

const app = express();
app.set("trust proxy", 1);
app.get("/helthcheck", (req, res) => {
  res.send("Server is running");
})
app.use(helmet());
const server = http.createServer(app);

initializeSocket(server);

const corsOptions = {
  origin: ["http://localhost:5173","https://dragon-tempura-sprint2.vercel.app"],
  credentials: true,
}

app.use(cors(corsOptions));
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

app.get("/", (req, res) => {
  res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>COLLECTICO API</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            background: #f7f9fc;
            color: #333;
            text-align: center;
            padding: 50px;
          }
          h1 {
            font-size: 2.5rem;
            color: #2c3e50;
          }
          p {
            font-size: 1.2rem;
            margin-top: 1rem;
          }
          code {
            background: #eee;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-size: 0.95rem;
          }
          .container {
            max-width: 600px;
            margin: auto;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1> Welcome to the Collectico</h1>
          <p>This is a REST API built with <strong>Express</strong>.</p>
          <p>Come to our member<code>POST /users-register</code>.</p>
          <p>✨ Welcome to our museum COLLECTIO!</p>
        </div>
      </body>
      </html>
    `);
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});