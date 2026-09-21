import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middleware/Auth.middleware.js";
import {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus,
} from "../controllers/application.controller.js";

const router = Router();

router.use(verifyJWT);

// Candidate Routes
router.route("/apply/:id").post(authorizeRoles("candidate"), applyJob);
router.route("/get").get(authorizeRoles("candidate"), getAppliedJobs);

// Recruiter Routes
router.route("/:id/applicants").get(authorizeRoles("recruiter"), getApplicants);
router.route("/status/:id").patch(authorizeRoles("recruiter"), updateStatus);

export default router;