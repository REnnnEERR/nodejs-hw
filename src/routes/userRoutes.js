import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { updateUserAvatar } from "../controllers/userController.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.patch(
  "/users/me/avatar",
  authenticate,
  // form
  // input name="user_avatar"
  upload.single("avatar"),
  updateUserAvatar
);

export default router;
