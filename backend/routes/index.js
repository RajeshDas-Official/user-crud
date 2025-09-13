import express from "express";
import userRoute from "./userRoute.js";
import { response } from "../utils/response.js";

// Router
var router = express.Router();

router.get("/", (req, res) => {
  try {
    return response(res, req.body, "Welcome User API", 200);
  } catch (error) {
    return response(res, req.body, error.message, 500);
  }
});
router.use("/users",userRoute);

export default router;