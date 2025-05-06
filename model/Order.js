import { Schema, model } from "mongoose";

const OrderSchema = new Schema({
  shipping: {
    type: String,
    enum: ["Standard", "Premium", "Expedited"],
    default: "Standard",
  },
  totalPrice: {type: Number, default: 0},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true, length: 10 },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: Number, required: true },
  country: { type: Number, required: true },
  paymentMethod: { type: String,
    enum: ["Credit Card", "Cash on Delivery",],
    default: "Cash on Delivery",
    required: true },
  status: {
    type: String,
    enum: ["completed", "onGoing"],
    default: "onGoing",
  },
  productId: { type: Array, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

  createdAt: { type: Date, default: new Date().getTime() },
  updatedAt: { type: Date, default: new Date().getTime() },
});

export const Order = model("Order", OrderSchema);
