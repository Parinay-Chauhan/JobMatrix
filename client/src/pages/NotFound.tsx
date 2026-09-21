import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/common";

export const NotFound: React.FC = () => {
  const { user } = useAuth();

  const dashboardPath =
    user?.role === "candidate"
      ? "/candidate/dashboard"
      : user?.role === "recruiter"
      ? "/recruiter/dashboard"
      : "/login";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-3xl border border-gray-200/80 shadow-xs">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-3xl bg-indigo-50 text-indigo-600 mb-6 font-black text-3xl">
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link to={dashboardPath}>
            <Button variant="primary" className="w-full">
              {user ? "Go to Dashboard" : "Sign In"}
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

export default NotFound;
