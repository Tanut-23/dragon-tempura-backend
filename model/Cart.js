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
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
});

export const Cart = model("Cart", CartSchema);