import { Schema, model } from "mongoose";

const bidSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isFinite,
      message: "Bid amount must be a valid number"
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Bid = model("Bid", bidSchema);