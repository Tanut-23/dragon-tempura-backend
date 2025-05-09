import express from "express";
import user from "../middlewares/user.js";
import product from "../middlewares/product.js";
import order from "../middlewares/order.js";


const router = express.Router();

    router.use("/api", user)
    router.use("/api", product)
    router.use("/api", order)

export default router;

// export default () => {
//     router.use("/api",user)
//     return router;
// }