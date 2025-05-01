import express from "express";
import user from "../middlewares/user.js";


const router = express.Router();

    router.use("/api", user)

export default router;

// export default () => {
//     router.use("/api",user)
//     return router;
// }