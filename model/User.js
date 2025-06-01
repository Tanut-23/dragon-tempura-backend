import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, length: 10 },
  password: { type: String, required: true, minlength: 6 },
  createOn: { type: Date, default: new Date().getTime() },
  wishlists: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      title: { type: String },
      image: { type: String },
      artist: { type: String },
      price: { type: Number },
      quantity: { type: Number, default: 1 },
    }
  ]
});

//Hash password

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
})





//User schema

export const User = model("User", UserSchema);