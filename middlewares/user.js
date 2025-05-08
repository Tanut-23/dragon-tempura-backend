import express from "express";
import { getUser, registerUser , loginUser, resetPassword, getUserById } from "../controller/usersControllers.js";
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

router.get("/auth/verify-token", authUser, (req, res) => {
    res.json({
      error: false,
      message: "Authenticated",
      user: req.user,
    });
  });


//-----Logout-----//
router.post("/auth/logout", authUser, (req, res) => {
  const isProduct = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduct ,
      sameSite: isProduct ? "strict" : "lax",
      path: "/",
    });
    res.json({
      error: false,
      message: "Logout success",
    });
  });
export default router;