import { Schema, model } from "mongoose";

const CartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
            title: { type: String },
            image: { type: String },
            artist: { type: String },
            price: { type: Number },
            quantity: { type: Number, default: 1 },
        },
    ],
    createdAt: { type: Date, default: new Date().getTime() },
    updatedAt: { type: Date, default: new Date().getTime() },
});

export const Cart = model("Cart", CartSchema);