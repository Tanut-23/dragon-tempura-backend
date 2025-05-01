import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },

  artist: { type: String, required: true },
  sellerName: { type: String, required: true },

  yearCreated: { type: Number },
  dimensions: {
    width: { type: Number },
    height: { type: Number },
    unit: { type: String, default: "cm" },
  },
  material: { type: String },

  tags: [
    {
      type: String,
      enum: [
        "Abstract",
        "Modern",
        "Contemporary",
        "Portrait",
        "Historical",
        "Classic",
      ],
    },
  ],

  price: { type: Number },
  minBidPrice: { type: Number },
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

  createdAt: { type: Date, default: new Date().getTime() },
  updatedAt: { type: Date, default: new Date().getTime() },
});

export const Product = model("Product", ProductSchema);
