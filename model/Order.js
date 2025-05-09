import { Schema, model } from "mongoose";

const OrderSchema = new Schema({
  shipping: {
    type: String,
    enum: ["Standard", "Premium", "Expedited"],
    default: "Standard",
  },
  totalPrice: {type: Number, default: 0},
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: false },
  phone: { type: String, required: false, length: 10 },
  address: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  zip: { type: Number, required: false },
  country: { type: Number, required: false },
  paymentMethod: { type: String,
    enum: ["Credit Card", "Cash on Delivery",],
    default: "Cash on Delivery",
    required: false },
  status: {
    type: String,
    enum: ["completed", "onGoing"],
    default: "onGoing",
  },
  productId: { type: Array, required: false },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: false },

  createdAt: { type: Date, default: new Date().getTime() },
  updatedAt: { type: Date, default: new Date().getTime() },
});

export const Order = model("Order", OrderSchema);
