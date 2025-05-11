import { Schema, model } from "mongoose";

const bidSchema = new Schema({
  productId: {
    type: Number,
    required: true,
  },
  firstName: String,
  lastName: String,
  amount: Number,
  time: {
    type: Date,
    default: Date.now,
  },
});

export const Bid = model("Bid", bidSchema);
