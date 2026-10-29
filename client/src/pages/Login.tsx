import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "../services";
import { useAuth } from "../context/AuthContext";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Real-time validation states ("Catch mistakes as people type, not after")
  const isEmailTouched = email.length > 0;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailError = isEmailTouched && !isEmailValid ? "Enter a valid email address." : "";
  const emailSuccess = isEmailTouched && isEmailValid ? "Looks good!" : "";

  const isPasswordTouched = password.length > 0;
  const isPasswordValid = password.length >= 6;
  const passwordError = isPasswordTouched && !isPasswordValid ? "Password must be at least 6 characters." : "";
  const passwordSuccess = isPasswordTouched && isPasswordValid ? "Looks good!" : "";

  const leftPanelRef = useRef<HTMLDivElement>(null);
  const brandingRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const { user, loading: authLoading, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === "recruiter") {
        navigate("/recruiter/dashboard", { replace: true });
      } else {
        navigate("/candidate/dashboard", { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isEmailValid) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isPasswordValid) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({ email, password });

      const userData = response.data.user;
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;

      login(userData, accessToken, refreshToken);
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

  // GSAP entrance animations
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Left panel elements slide in from left
    if (brandingRef.current) {
      gsap.set(brandingRef.current, { x: -60, opacity: 0 });
      tl.to(brandingRef.current, { x: 0, opacity: 1, duration: 0.7 }, 0.1);
    }
    if (headingRef.current) {
      gsap.set(headingRef.current, { x: -80, opacity: 0 });
      tl.to(headingRef.current, { x: 0, opacity: 1, duration: 0.8 }, 0.25);
    }
    if (subtextRef.current) {
      gsap.set(subtextRef.current, { x: -60, opacity: 0 });
      tl.to(subtextRef.current, { x: 0, opacity: 1, duration: 0.7 }, 0.4);
    }
    if (statsRef.current) {
      gsap.set(statsRef.current, { x: -50, opacity: 0 });
      tl.to(statsRef.current, { x: 0, opacity: 1, duration: 0.6 }, 0.55);
    }

    // Form card fades in from right
    if (formCardRef.current) {
      gsap.set(formCardRef.current, { x: 40, opacity: 0 });
      tl.to(formCardRef.current, { x: 0, opacity: 1, duration: 0.7 }, 0.3);
    }
  }, []);

  return (
    <div className="min-h-screen flex bg-slate-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-sky-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Left Panel — Branding */}
      <div ref={leftPanelRef} className="hidden lg:flex flex-col justify-between w-1/2 relative z-10 p-12 pl-16 pr-10 items-end">
        <div className="w-full max-w-lg">
          <div ref={brandingRef}>
            <Link to="/" className="inline-flex items-center group">
              <span className="text-3xl font-black tracking-tight text-white group-hover:opacity-90 transition-opacity">
                Job<span className="bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400 bg-clip-text text-transparent">Matrix</span>
              </span>
            </Link>
          </div>
        </div>

        <div className="w-full max-w-lg space-y-7">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Top Career Platform
          </div>

          <h1 ref={headingRef} className="text-5xl xl:text-6xl font-black text-white leading-[1.12] tracking-tight">
            Your career journey{" "}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400 bg-clip-text text-transparent">
              starts here
            </span>
          </h1>

          <p ref={subtextRef} className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Connect with top companies, discover opportunities that match your skills, and take the next leap in your professional career.
          </p>

          {/* Trust indicators */}
          <div ref={statsRef} className="flex items-center gap-8 pt-4">
            <div>
              <p className="text-3xl font-black text-white tracking-tight">10k+</p>
              <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-0.5">Active Jobs</p>
            </div>
            <div className="w-px h-12 bg-slate-800" />
            <div>
              <p className="text-3xl font-black text-white tracking-tight">500+</p>
              <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-0.5">Companies</p>
            </div>
            <div className="w-px h-12 bg-slate-800" />
            <div>
              <p className="text-3xl font-black text-white tracking-tight">50k+</p>
              <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-0.5">Candidates</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-lg">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} JobMatrix. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center group">
              <span className="text-2xl font-black tracking-tight text-white group-hover:opacity-90 transition-opacity">
                Job<span className="bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400 bg-clip-text text-transparent">Matrix</span>
              </span>
            </Link>
          </div>

          {/* Card */}
          <div ref={formCardRef} className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-8 shadow-2xl shadow-black/20">
            <div className="space-y-1 mb-7">
              <h2 className="text-2xl font-extrabold text-white">Welcome back</h2>
              <p className="text-sm text-slate-400">
                Sign in to access your dashboard and opportunities
              </p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3.5 text-xs text-red-400 font-medium flex items-center gap-2 mb-5">
                <svg
                  className="w-4 h-4 shrink-0 text-red-400"
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

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field with Real-time Validation */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-4.5 h-4.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="riya@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-xl border pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all duration-150 focus:outline-none focus:ring-2 ${
                      emailError
                        ? "border-red-500 focus:border-red-400 focus:ring-red-500/20 bg-red-950/10"
                        : emailSuccess
                        ? "border-emerald-500 focus:border-emerald-400 focus:ring-emerald-500/20 bg-emerald-950/10"
                        : "border-slate-700/80 bg-slate-800/50 hover:border-slate-600 focus:border-blue-500/60 focus:ring-blue-500/40"
                    }`}
                  />
                  {emailError ? (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-red-500 animate-in fade-in zoom-in-75 duration-150">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : emailSuccess ? (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-500 animate-in fade-in zoom-in-75 duration-150">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : null}
                </div>
                {emailError ? (
                  <p className="text-xs text-red-400 font-medium flex items-center gap-1.5 mt-1 animate-in fade-in duration-150">
                    <span>{emailError}</span>
                  </p>
                ) : emailSuccess ? (
                  <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 mt-1 animate-in fade-in duration-150">
                    <span>{emailSuccess}</span>
                  </p>
                ) : null}
              </div>

              {/* Password Field with Real-time Validation */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-4.5 h-4.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full rounded-xl border pl-10 pr-16 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all duration-150 focus:outline-none focus:ring-2 ${
                      passwordError
                        ? "border-red-500 focus:border-red-400 focus:ring-red-500/20 bg-red-950/10"
                        : passwordSuccess
                        ? "border-emerald-500 focus:border-emerald-400 focus:ring-emerald-500/20 bg-emerald-950/10"
                        : "border-slate-700/80 bg-slate-800/50 hover:border-slate-600 focus:border-blue-500/60 focus:ring-blue-500/40"
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-2">
                    {passwordError ? (
                      <span className="text-red-500 animate-in fade-in zoom-in-75 duration-150">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : passwordSuccess ? (
                      <span className="text-emerald-500 animate-in fade-in zoom-in-75 duration-150">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-500 hover:text-slate-300 transition-colors"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                {passwordError ? (
                  <p className="text-xs text-red-400 font-medium flex items-center gap-1.5 mt-1 animate-in fade-in duration-150">
                    <span>{passwordError}</span>
                  </p>
                ) : passwordSuccess ? (
                  <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 mt-1 animate-in fade-in duration-150">
                    <span>{passwordSuccess}</span>
                  </p>
                ) : null}
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-3 rounded-xl text-white text-sm font-bold transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-orange-500/25"
                style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">or</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Register Link */}
            <p className="text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-orange-400 hover:text-orange-300 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>

          {/* Back to home */}
          <p className="text-center mt-6">
            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
