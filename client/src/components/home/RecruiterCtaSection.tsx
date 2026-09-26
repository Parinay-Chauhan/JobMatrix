import React from "react";
import { Link } from "react-router-dom";

export const RecruiterCtaSection: React.FC = () => {
  return (
    <section id="hire" className="bg-gray-50 py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-100/80 shadow-sm flex flex-col md:flex-row items-center min-h-[220px]">
          {/* Left — Decorative Abstract Illustration */}
          <div className="hidden md:flex items-end justify-center w-[260px] shrink-0 self-stretch pl-10 pt-6 relative">
            <svg viewBox="0 0 220 200" className="w-full h-auto max-h-[200px] mt-auto" xmlns="http://www.w3.org/2000/svg">
              {/* Person 1 — standing back */}
              <ellipse cx="75" cy="196" rx="30" ry="6" fill="#d1fae5" opacity="0.7" />
              <rect x="55" y="100" width="40" height="90" rx="6" fill="#059669" opacity="0.9" />
              <circle cx="75" cy="88" r="22" fill="#d1fae5" />
              <rect x="60" y="88" width="30" height="18" rx="4" fill="#059669" opacity="0.9" />
              <circle cx="69" cy="85" r="2.5" fill="#059669" />
              <circle cx="81" cy="85" r="2.5" fill="#059669" />
              <path d="M70 93 Q75 97 80 93" stroke="#059669" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <rect x="35" y="110" width="20" height="8" rx="4" fill="#6ee7b7" transform="rotate(-15 45 114)" />
              <rect x="95" y="112" width="20" height="8" rx="4" fill="#6ee7b7" transform="rotate(15 115 116)" />

              {/* Person 2 — in front */}
              <ellipse cx="145" cy="196" rx="28" ry="5" fill="#d1fae5" opacity="0.7" />
              <rect x="126" y="115" width="38" height="80" rx="6" fill="#0d9488" opacity="0.95" />
              <circle cx="145" cy="103" r="20" fill="#ccfbf1" />
              <rect x="132" y="103" width="26" height="16" rx="4" fill="#0d9488" opacity="0.9" />
              <circle cx="139" cy="100" r="2" fill="#0d9488" />
              <circle cx="151" cy="100" r="2" fill="#0d9488" />
              <path d="M140 107 Q145 111 150 107" stroke="#0d9488" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <rect x="106" y="124" width="20" height="7" rx="4" fill="#5eead4" transform="rotate(-10 116 127)" />
              <rect x="163" y="126" width="20" height="7" rx="4" fill="#5eead4" transform="rotate(10 173 129)" />

              {/* Floating briefcase icon */}
              <rect x="165" y="50" width="32" height="26" rx="5" fill="#059669" opacity="0.15" />
              <rect x="172" y="45" width="18" height="9" rx="3" fill="none" stroke="#059669" strokeWidth="2" />
              <rect x="165" y="50" width="32" height="26" rx="5" fill="none" stroke="#059669" strokeWidth="2" opacity="0.6" />
              <line x1="181" y1="50" x2="181" y2="76" stroke="#059669" strokeWidth="1.5" opacity="0.4" />

              {/* Sparkles */}
              <circle cx="30" cy="50" r="3" fill="#fbbf24" opacity="0.8" />
              <circle cx="50" cy="30" r="2" fill="#059669" opacity="0.5" />
              <circle cx="200" cy="80" r="2.5" fill="#10b981" opacity="0.7" />
              <circle cx="190" cy="35" r="4" fill="#f59e0b" opacity="0.5" />
            </svg>
          </div>

          {/* Right — Text & CTA */}
          <div className="flex-1 flex flex-col items-start justify-center py-10 px-8 sm:px-10">
            {/* Badge */}
            <span className="inline-block text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.18em] bg-emerald-100 text-emerald-800 px-3.5 py-1 rounded-full mb-4">
              JobMatrix for Employers
            </span>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Want to hire?
            </h2>

            {/* Subtext */}
            <p className="text-gray-600 text-sm sm:text-base mt-3 mb-6 max-w-sm leading-relaxed">
              Find the best candidate from{" "}
              <span className="font-semibold text-emerald-700">10,000+ active job seekers</span>{" "}
              — post your first job in under 2 minutes.
            </p>

            {/* Quick Stats Row */}
            <div className="flex flex-wrap gap-5 mb-7 text-sm">
              <div>
                <span className="font-extrabold text-gray-900 text-lg">10k+</span>
                <span className="text-gray-500 ml-1.5">Active Candidates</span>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <span className="font-extrabold text-gray-900 text-lg">24h</span>
                <span className="text-gray-500 ml-1.5">Avg. First Response</span>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <span className="font-extrabold text-gray-900 text-lg">Free</span>
                <span className="text-gray-500 ml-1.5">to Post a Job</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-900 text-gray-900 text-sm font-bold hover:bg-gray-900 hover:text-white transition-all duration-200 group"
              >
                Post a Job
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all duration-200 hover:opacity-90 hover:scale-105 active:scale-95 shadow-md shadow-emerald-500/25"
                style={{ background: "linear-gradient(135deg, #059669 0%, #0d9488 100%)" }}
              >
                Create Recruiter Account
              </Link>
            </div>
          </div>

          {/* Decorative background blobs */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-emerald-100/60 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-gradient-to-tr from-teal-100/50 to-transparent rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>
    </section>
  );
};
