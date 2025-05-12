import express from "express";
import { getUser, registerUser , loginUser, resetPassword, getUserById, logoutUser, verifyToken } from "../controller/usersControllers.js";
import { authUser } from "./authMiddleware.js";

const router = express.Router()

//Register user
router.post("/users-register", registerUser )

//Login User
router.post("/users-login" ,loginUser)

//Re-password user
router.patch("/users-resetpassword", resetPassword)

router.get("/users", getUser)
router.get("/users/:id", getUserById)

//-----Check login-----//

router.get("/auth/verify-token", authUser, verifyToken);


//-----Logout-----//
router.post("/auth/logout", authUser, logoutUser);
export default router;