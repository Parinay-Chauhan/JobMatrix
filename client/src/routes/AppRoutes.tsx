import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";

// Placeholder Views
const JobListings = () => <div className="p-8">Public Jobs Page</div>;
const Login = () => <div className="p-8">Login Page</div>;
const Register = () => <div className="p-8">Register Page</div>;
const CandidateDashboard = () => <div className="p-8">Candidate Dashboard</div>;
const RecruiterDashboard = () => <div className="p-8">Recruiter Dashboard</div>;
const Unauthorized = () => <div className="p-8 text-red-500 font-semibold">403 - Unauthorized Access</div>;

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