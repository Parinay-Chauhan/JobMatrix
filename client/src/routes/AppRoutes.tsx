import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { CandidateLayout } from "../layouts/CandidateLayout";
import { RecruiterLayout } from "../layouts/RecruiterLayout";
import { PostJob } from "../pages/recruiter/PostJob";
import { ManageJobs } from "../pages/recruiter/ManageJobs";
import { JobApplicants } from "../pages/recruiter/JobApplicants";
import { FindJobs } from "../pages/candidate/FindJobs";
import { MyApplications } from "../pages/candidate/MyApplications";
import { CandidateProfile } from "../pages/candidate/CandidateProfile";

// Placeholder Views
const JobListings = () => (
  <div className="font-bold text-gray-800">Public Jobs Listing</div>
);

// Recruiter Placeholders
const RecruiterDashboard = () => (
  <div className="font-bold text-blue-600 text-xl">
    Recruiter Dashboard Page
  </div>
);

const Unauthorized = () => (
  <div className="p-8 text-red-500 font-bold">403 - Unauthorized Access</div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<JobListings />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Candidate Routes */}
      <Route element={<ProtectedRoute allowedRoles={["candidate"]} />}>
        <Route element={<CandidateLayout />}>
          <Route path="/candidate/dashboard" element={<FindJobs />} />
          <Route path="/candidate/find-jobs" element={<FindJobs />} />
          <Route path="/candidate/applications" element={<MyApplications />} />
          <Route path="/candidate/profile" element={<CandidateProfile />} />
        </Route>
      </Route>

      {/* Protected Recruiter Routes */}
      <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
        <Route element={<RecruiterLayout />}>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/jobs/new" element={<PostJob />} />
          <Route path="/recruiter/jobs" element={<ManageJobs />} />
          <Route
            path="/recruiter/jobs/:jobId/applicants"
            element={<JobApplicants />}
          />
        </Route>
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
