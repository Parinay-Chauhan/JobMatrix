import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "../services";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/common";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login({ email, password });

      const userData = response.data.user;
      const accessToken = response.data.accessToken;

      login(userData, accessToken);
      toast.success(`Welcome back, ${userData.fullName || userData.username}!`, {
        description: `Logged in as ${userData.role}.`,
      });

      if (userData.role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else {
        navigate("/candidate/dashboard");
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Login failed. Please check credentials.";
      setError(msg);
      toast.error("Authentication Error", {
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/80 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="inline-block text-2xl font-black text-indigo-600 tracking-tight"
          >
            JobPortal
          </Link>
          <h2 className="text-2xl font-extrabold text-gray-900">Welcome back</h2>
          <p className="text-xs text-gray-500">
            Sign in to access your dashboard and opportunities
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700 font-medium flex items-center gap-2">
            <svg
              className="w-4 h-4 shrink-0 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={loading}
            className="w-full mt-2"
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
