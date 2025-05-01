import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

//Create Schema

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, length: 10 },
  password: { type: String, required: true, minlength: 6 },
  createOn: { type : Date, default: new Date().getTime() },
});

//Hash password

UserSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
})


//User schema

export const User = model("User" , UserSchema);