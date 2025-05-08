import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/route.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

const port = process.env.PORT;

(async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to Mongo database");
    } catch (err){
      console.error(`MongoDB connection error: ${err}`)
      process.exit(1);
    }
  })();

app.use("", router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
