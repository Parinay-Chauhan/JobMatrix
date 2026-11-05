import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export const RecruiterCtaSection: React.FC = React.memo(() => {
  return (
    <section id="hire" className="bg-slate-950 py-14 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950/90 border border-white/10 p-6 sm:p-10 backdrop-blur-md shadow-2xl">
          {/* Ambient glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-28 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hiring infrastructure</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                Scale your engineering team with top-tier talent
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-xl">
                Access verified developers, AI-ranked ATS candidate profiles, and direct applicant tracking without recruiter spam or commission markups.
              </p>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-6 sm:gap-10 pt-6 border-t border-white/[0.08] max-w-lg">
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-white">
                    10,000+
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                    Active profiles
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-white whitespace-nowrap">
                    &lt; 24h
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                    First response
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-white">
                    0%
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                    Placement fee
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-200 shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] active:scale-95"
              >
                <span>Create recruiter account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white text-sm font-medium transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                <span>Sign in to dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default RecruiterCtaSection;
