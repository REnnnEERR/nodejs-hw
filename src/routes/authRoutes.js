import { Router } from "express";
import { celebrate } from "celebrate";
import {
  loginUserSchema,
  regsiterUserSchema,
} from "../validations/authValidation.js";
import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser
} from "../controllers/authController.js";

const router = Router();

router.post("/auth/register", celebrate(regsiterUserSchema), registerUser);
router.post("/auth/login", celebrate(loginUserSchema), loginUser);
router.post("/auth/logout", logoutUser);
router.post("/auth/refresh", refreshSession);
export default router;
