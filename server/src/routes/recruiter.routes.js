import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middleware/Auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  createRecruiterProfile,
  getRecruiterProfile,
  updateRecruiterProfile,
  uploadCompanyLogo,
  updateCompanyLogo,
  deleteCompanyLogo,
  getRecruiterDashboardStats,
} from "../controllers/recruiter.controller.js";

const router = Router();

// Secure all recruiter routes
router.use(verifyJWT);
router.use(authorizeRoles("recruiter"));
// router.use(verifyJWT, authorizeRoles("recruiter"));

// Profile Routes
router
  .route("/profile")
  .post(createRecruiterProfile)
  .get(getRecruiterProfile)
  .patch(updateRecruiterProfile);

// Company Logo Routes
router
  .route("/logo")
  .post(upload.single("logo"), uploadCompanyLogo) // First time logo upload (201 Created)
  .patch(upload.single("logo"), updateCompanyLogo) // Replace existing logo (200 OK)
  .delete(deleteCompanyLogo);

// Dashboard Routes
router.route("/dashboard/stats").get(getRecruiterDashboardStats);

export default router;
