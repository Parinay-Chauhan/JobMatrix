import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const DashboardFooter: React.FC = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();
  const isCandidate = user?.role === "candidate";
  const isRecruiter = user?.role === "recruiter";

  const workspaceLinks = isCandidate
    ? [
        { label: "Explore Jobs", href: "/candidate/find-jobs" },
        { label: "Applications Tracker", href: "/candidate/applications" },
        { label: "AI ATS Optimizer", href: "/candidate/resume-optimizer" },
        { label: "Profile & Resume", href: "/candidate/profile" },
      ]
    : isRecruiter
    ? [
        { label: "Dashboard", href: "/recruiter/dashboard" },
        { label: "Post New Job", href: "/recruiter/jobs/new" },
        { label: "Manage Openings", href: "/recruiter/jobs" },
        { label: "Company Profile", href: "/recruiter/profile" },
      ]
    : [
        { label: "Find Jobs", href: "/candidate/find-jobs" },
        { label: "Recruiter Portal", href: "/recruiter/dashboard" },
      ];

  const supportLinks = [
    { label: "Help & Support", href: "/support" },
    { label: "Documentation", href: "/docs" },
    { label: "Career Guide", href: "/career-guide" },
    { label: "Contact Us", href: "/contact" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ];

  return (
    <footer className="w-full bg-slate-950/95 border-t border-slate-800/80 text-slate-400 relative z-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 pb-10">
          {/* Brand Info & Socials */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="flex items-end gap-1 h-5 py-0.5">
                <span className="w-1 h-3 bg-blue-500 rounded-full" />
                <span className="w-1 h-4.5 bg-sky-400 rounded-full" />
                <span className="w-1 h-2 bg-orange-500 rounded-full" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:opacity-90 transition-opacity">
                Job<span className="bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400 bg-clip-text text-transparent">Matrix</span>
              </span>
              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 border border-slate-700/80 text-slate-300">
                {isCandidate ? "Candidate Portal" : isRecruiter ? "Employer Portal" : "Portal"}
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed font-normal">
              Enterprise hiring intelligence and career acceleration platform connecting tech talent with top engineering teams.
            </p>

            {/* Social Icons Row */}
            <div className="flex items-center gap-4 pt-1 text-slate-400">
              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="hover:text-white transition-colors p-1 -m-1"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="hover:text-white transition-colors p-1 -m-1"
              >
                <svg
                  className="w-4 h-4 fill-none stroke-current stroke-2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* Discord */}
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="hover:text-white transition-colors p-1 -m-1"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 1: Quick Workspace */}
          <div className="space-y-3">
            <p className="text-xs sm:text-sm font-semibold text-white tracking-tight">
              {isCandidate ? "Candidate Workspace" : isRecruiter ? "Employer Hub" : "Workspace"}
            </p>
            <ul className="space-y-2 text-xs sm:text-sm">
              {workspaceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-white transition-colors duration-150 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Support & Docs */}
          <div className="space-y-3">
            <p className="text-xs sm:text-sm font-semibold text-white tracking-tight">Support & Help</p>
            <ul className="space-y-2 text-xs sm:text-sm">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-white transition-colors duration-150 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Privacy */}
          <div className="space-y-3">
            <p className="text-xs sm:text-sm font-semibold text-white tracking-tight">Legal & Trust</p>
            <ul className="space-y-2 text-xs sm:text-sm">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-white transition-colors duration-150 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Trust badge & Operational Status */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} JobMatrix Technologies Inc. All rights reserved.</p>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/80 animate-pulse" />
            <span className="hover:text-slate-400 transition-colors">Status: All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
