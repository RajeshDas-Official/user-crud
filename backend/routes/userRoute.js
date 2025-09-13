import express from "express";
import { response } from "../utils/response.js";
import { createUser, deleteUser, getUser, getUsers, updateUser, verifyUser } from "../controllers/userController.js";
import { handleValidationErrors, validateUpdateUser, validateUser } from "../middleware/validation.js";


// Router
var router = express.Router();



router.route('/')
  .get(getUsers)
  .post(validateUser, handleValidationErrors, createUser);

router.route('/:id')
  .get(getUser)
  .put(validateUpdateUser, handleValidationErrors, updateUser)
  .delete(deleteUser);

router.route('/:id/verify')
  .patch(verifyUser);
export default router;