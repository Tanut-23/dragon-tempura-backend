import express from "express";
import user from "../middlewares/user.js";
import product from "../middlewares/product.js";


const router = express.Router();

    router.use("/api", user)
    router.use("/api", product)

export default router;

// export default () => {
//     router.use("/api",user)
//     return router;
// }