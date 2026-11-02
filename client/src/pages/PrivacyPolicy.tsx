import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Eye, FileText, Database, UserCheck, Bell } from "lucide-react";
import { HomeFooter } from "../components/home/HomeFooter";

export const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = "October 2026";

  const sections = [
    {
      icon: <Database className="w-5 h-5 text-blue-400" />,
      title: "1. Information We Collect",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            When you register, apply for roles, or post openings on JobMatrix, we collect specific data to deliver seamless recruitment services:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li><strong className="text-slate-200">Candidate Profiles:</strong> Full name, contact email, phone number, location, professional headline, resume documents (PDF/DOCX), education, work history, and portfolio links.</li>
            <li><strong className="text-slate-200">ATS & Match Analytics:</strong> Extracted resume skills, algorithmic matching scores, job application timestamps, and recruiter review milestones.</li>
            <li><strong className="text-slate-200">Recruiter Information:</strong> Company name, verified business email, corporate domain, hiring department, and posted job descriptions.</li>
            <li><strong className="text-slate-200">Technical Log Data:</strong> Anonymized IP address, browser type, device identifiers, and session tokens strictly used for authentication, rate-limiting, and fraud prevention.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: <Eye className="w-5 h-5 text-sky-400" />,
      title: "2. How We Utilize Your Information",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            JobMatrix operates on a privacy-first principle. Your personal and professional information is utilized strictly for verified hiring operations:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li>Facilitating direct job applications between candidates and verified recruiters.</li>
            <li>Calculating ATS keyword compatibility and parsing qualifications to recommend relevant opportunities.</li>
            <li>Delivering real-time status updates (e.g., Shortlisted, Reviewed, or Interview Invitation) via in-app notifications and email alerts.</li>
            <li>Preventing recruitment scams, duplicate applicant submissions, and unauthorized automated bots.</li>
            <li><strong className="text-slate-200">No Selling of Data:</strong> We never sell, rent, or lease candidate resumes or recruiter contact rosters to third-party ad networks or brokers.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: <Lock className="w-5 h-5 text-orange-400" />,
      title: "3. Data Sharing & Disclosure",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            We only disclose your application details under clear, transparent conditions:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li><strong className="text-slate-200">To Prospective Employers:</strong> When you actively click "Apply Now", your profile, resume, and contact details are made accessible strictly to that verified recruiter.</li>
            <li><strong className="text-slate-200">Service Infrastructure:</strong> Secure cloud storage providers (e.g., Cloudinary for encrypted resume files, MongoDB Atlas for database operations) operating under strict data processing agreements.</li>
            <li><strong className="text-slate-200">Legal Compliance:</strong> If mandated by law, court subpoena, or to protect the safety and platform integrity of our community.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: <Shield className="w-5 h-5 text-blue-400" />,
      title: "4. Security & Encryption Standards",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Security is engineered into JobMatrix at every layer:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li>All network transmissions are guarded by 256-bit TLS/SSL encryption.</li>
            <li>Authentication is powered by cryptographic HTTP-only JSON Web Tokens (JWT) with automatic token rotation and reuse detection.</li>
            <li>Resumes are stored on secure cloud repositories protected with strict access control lists (ACLs).</li>
            <li>Passwords and sensitive tokens are hashed using industry-standard bcrypt with high salt rounds.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: <UserCheck className="w-5 h-5 text-emerald-400" />,
      title: "5. Your Privacy Rights & Controls",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Regardless of your geographic location, JobMatrix provides users full sovereignty over their career information:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li><strong className="text-slate-200">Profile Edits & Updates:</strong> Modify your resume, headline, skills, or portfolio anytime via Candidate Settings.</li>
            <li><strong className="text-slate-200">Right to Erasure (Delete Account):</strong> Request total purge of your user record, application histories, and uploaded documents from our primary databases.</li>
            <li><strong className="text-slate-200">Notification Preferences:</strong> Toggle recruitment alerts, match digests, and application status emails at your discretion.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: <Bell className="w-5 h-5 text-orange-400" />,
      title: "6. Updates to This Policy & Contact",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            We may periodically revise this Privacy Policy to reflect platform features or regulatory updates. We will notify active users of material revisions via in-app alerts.
          </p>
          <p className="text-slate-400">
            For privacy inquiries, data export requests, or security disclosures, contact our Data Protection Team at:{" "}
            <span className="text-blue-400 font-mono">privacy@jobmatrix.dev</span>
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="flex items-end gap-1 h-5 py-0.5">
              <span className="w-1 h-3 bg-blue-500 rounded-full" />
              <span className="w-1 h-4.5 bg-sky-400 rounded-full" />
              <span className="w-1 h-2 bg-orange-500 rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:opacity-90 transition-opacity">
              Job<span className="bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400 bg-clip-text text-transparent">Matrix</span>
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-full border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header Banner */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>Trust & Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Your privacy is foundational to how we build JobMatrix. Learn how we safeguard your personal data, resumes, and job applications.
          </p>
          <div className="mt-3 text-xs text-slate-500 font-mono">
            Last Modified: {lastUpdated} • Version 2.4
          </div>
        </div>

        {/* Highlight Summary Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/20 mb-10 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 shrink-0 mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Privacy Snapshot: What You Need to Know
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                We only collect the data necessary to match you with verified recruiters, power our ATS resume scoring, and streamline hiring. We do not sell your personal data to advertisers. You maintain complete control to edit or delete your profile at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Section Cards */}
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  {section.icon}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {section.title}
                </h2>
              </div>
              <div>{section.content}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <HomeFooter />
    </div>
  );
};

export default PrivacyPolicy;

