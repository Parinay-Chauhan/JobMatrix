import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  changePassword,
  updateAccountDetails,
  updateUserAvatar,
  deleteUserAvatar,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validators/auth.validator.js";

const router = Router();

// Public routes with Zod schema validation
router.route("/register").post(validate(registerUserSchema), registerUser);
router.route("/login").post(validate(loginUserSchema), loginUser);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/delete-avatar").delete(verifyJWT, deleteUserAvatar);

export default router;
