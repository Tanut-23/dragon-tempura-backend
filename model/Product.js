import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },

  artist: { type: String, required: true },
  sellerName: { type: String, required: true },

  yearCreated: { type: String },
  dimensions: { type: String },
  material: { type: String },

  tags: { type: Array },

  price: { type: String },
  minBidPrice: { type: String },
  auction: {
    isAuction: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
    days: { type: Number },
    hours: { type: Number },
  },

  status: {
    type: String,
    enum: ["completed", "onGoing"],
    default: "onGoing",
  },

  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

  createdAt: { type: Date, default: new Date().getTime() },
  updatedAt: { type: Date, default: new Date().getTime() },
});

export const Product = model("Product", ProductSchema);
