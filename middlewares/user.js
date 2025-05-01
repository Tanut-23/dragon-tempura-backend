import express from "express";
import { getUser, registerUser , loginUser, resetPassword } from "../controller/usersControllers.js";
import { authUser } from "./authMiddleware.js";

const router = express.Router()

//Register user
router.post("/users-register", registerUser )

//Login User
router.post("/users-login" ,loginUser)

//Re-password user
router.patch("/users-resetpassword", resetPassword)

router.get("/users", getUser)
export default router;