import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { CandidateLayout } from "../layouts/CandidateLayout";
import { RecruiterLayout } from "../layouts/RecruiterLayout";

// Placeholder Views
const JobListings = () => (
  <div className="font-bold text-gray-800">Public Jobs Listing</div>
);
const CandidateDashboard = () => (
  <div className="font-bold text-green-600 text-xl">
    Candidate Dashboard Page
  </div>
);
const CandidateApplications = () => (
  <div className="font-bold text-indigo-600 text-xl">
    My Applications List Page
  </div>
);

// Recruiter Placeholders
const RecruiterDashboard = () => (
  <div className="font-bold text-blue-600 text-xl">
    Recruiter Dashboard Page
  </div>
);
const PostJob = () => (
  <div className="font-bold text-indigo-600 text-xl">
    Post New Job Form Page
  </div>
);
const ManageJobs = () => (
  <div className="font-bold text-gray-800 text-xl">Manage Jobs List Page</div>
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

      {/* Protected Candidate Routes with Candidate Layout */}
      <Route element={<ProtectedRoute allowedRoles={["candidate"]} />}>
        <Route element={<CandidateLayout />}>
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route
            path="/candidate/applications"
            element={<CandidateApplications />}
          />
        </Route>
      </Route>

      {/* Protected Recruiter Routes with Recruiter Layout */}
      <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
        <Route element={<RecruiterLayout />}>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/jobs/new" element={<PostJob />} />
          <Route path="/recruiter/jobs" element={<ManageJobs />} />
        </Route>
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
