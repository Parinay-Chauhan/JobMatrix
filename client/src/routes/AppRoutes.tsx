import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// Updated import path if ProtectedRoute is inside src/routes/
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";

// Placeholder Views
const JobListings = () => (
  <div className="p-8 font-bold text-gray-800">Public Jobs Listing</div>
);
const CandidateDashboard = () => (
  <div className="p-8 font-bold text-green-600">Candidate Dashboard</div>
);
const RecruiterDashboard = () => (
  <div className="p-8 font-bold text-blue-600">Recruiter Dashboard</div>
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
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
      </Route>

      {/* Protected Recruiter Routes */}
      <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
