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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-16 font-sans">
      <div className="max-w-md w-full text-center bg-slate-900/80 p-8 sm:p-10 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl space-y-6">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono font-black text-3xl">
          404
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed font-normal">
            The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link to={dashboardPath}>
            <Button variant="primary" className="w-full">
              {user ? "Go to Dashboard" : "Sign In"}
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
