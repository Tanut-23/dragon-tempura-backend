import { User } from "../model/User.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//-----Get User------//
export const getUser = async (req, res) => {
  try {
    const user = await User.find();
    res.json({ error: false, user });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Fail to fetch",
      detail: err.message,
    });
  }
};

//-----Register-----//

export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      error: true,
      message: "All fields are required",
    });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: true, message: "Email already in use" });
    }

    const user = new User({ firstName, lastName, email, password, phone });

    await user.save();

    res
      .status(201)
      .json({ error: false, user, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error",
      detail: err.message,
    });
  }
};

//-----Login-----//

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Email and password are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!user || !passwordCheck) {
      return res.status(401).json({
        error: true,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      error: false,
      message: "Login successful!",
      _id: user.id,
      email: user.email,
      token,
      // token: generateToken(user.id),
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error",
      detail: err.message,
    });
  }
};

//-----ResetPassword-----//

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Email and password are required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Invalid credentials",
      });
    }

    user.password = password;
    await user.save();
    res.json({
      error: false,
      detail: req.body,
      message: "Password is changed already",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error",
      detail: err.message,
    });
  }
};
