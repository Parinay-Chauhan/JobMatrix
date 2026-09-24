import React, { lazy, Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import { Button, PageLoader } from "../components/common";
import { CandidateLayout } from "../layouts/CandidateLayout";
import { RecruiterLayout } from "../layouts/RecruiterLayout";

// Route-level code-splitting with React.lazy
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const FindJobs = lazy(() => import("../pages/candidate/FindJobs"));
const MyApplications = lazy(() => import("../pages/candidate/MyApplications"));
const CandidateProfile = lazy(() => import("../pages/candidate/CandidateProfile"));
const RecruiterProfile = lazy(() => import("../pages/recruiter/RecruiterProfile"));
const RecruiterDashboard = lazy(() => import("../pages/recruiter/RecruiterDashboard"));
const PostJob = lazy(() => import("../pages/recruiter/PostJob"));
const ManageJobs = lazy(() => import("../pages/recruiter/ManageJobs"));
const JobApplicants = lazy(() => import("../pages/recruiter/JobApplicants"));
const NotFound = lazy(() => import("../pages/NotFound"));

const Unauthorized: React.FC = () => {
  const { user } = useAuth();
  const dashboardLink =
    user?.role === "candidate"
      ? "/candidate/dashboard"
      : user?.role === "recruiter"
      ? "/recruiter/dashboard"
      : "/login";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-rose-50 text-rose-600 mb-5">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          403 - Access Restricted
        </h1>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          You do not have the required role permissions to access this page. Your account is registered as a{" "}
          <span className="font-bold text-gray-800 capitalize">
            {user?.role || "Guest"}
          </span>
          .
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link to={dashboardLink}>
            <Button variant="primary" className="w-full">
              Go to Your Dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="w-full">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
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
            <Route path="/recruiter/profile" element={<RecruiterProfile />} />
            <Route path="/recruiter/jobs/new" element={<PostJob />} />
            <Route path="/recruiter/jobs" element={<ManageJobs />} />
            <Route
              path="/recruiter/jobs/:jobId/applicants"
              element={<JobApplicants />}
            />
          </Route>
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
