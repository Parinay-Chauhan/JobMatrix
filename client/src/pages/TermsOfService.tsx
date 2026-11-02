import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Scale, CheckCircle2, AlertTriangle, Briefcase, FileCheck, Ban, HelpCircle } from "lucide-react";
import { HomeFooter } from "../components/home/HomeFooter";

export const TermsOfService: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = "October 2026";

  const sections = [
    {
      icon: <CheckCircle2 className="w-5 h-5 text-blue-400" />,
      title: "1. Acceptance of Terms & Eligibility",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            By accessing or registering an account on JobMatrix, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, you must discontinue use of the platform immediately.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li>You must be at least 18 years of age or the legal age of majority in your jurisdiction to create an account.</li>
            <li>You represent and warrant that all information provided during registration is accurate, current, and complete.</li>
            <li>Accounts are strictly non-transferable and may not be shared across individuals or automated entities.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: <FileCheck className="w-5 h-5 text-sky-400" />,
      title: "2. Candidate Conduct & Application Rules",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Candidates utilize JobMatrix to showcase credentials, discover opportunities, and connect with hiring teams:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li><strong className="text-slate-200">Authentic Credentials:</strong> You must submit truthful resume details, employment history, certifications, and project repositories. Fabrication or impersonation constitutes immediate grounds for termination.</li>
            <li><strong className="text-slate-200">Application Consent:</strong> Clicking "Apply Now" grants the specified recruiter permission to inspect your profile, download your uploaded resume, and contact you regarding recruitment.</li>
            <li><strong className="text-slate-200">Respectful Communication:</strong> All messaging, inquiries, and interview interactions must adhere to professional workplace standards. Harassment of hiring managers or team members will not be tolerated.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: <Briefcase className="w-5 h-5 text-orange-400" />,
      title: "3. Recruiter & Employer Obligations",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Recruiters and hiring organizations must maintain ethical, transparent recruitment practices:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li><strong className="text-slate-200">Legitimate Postings Only:</strong> All listings must correspond to genuine, active employment vacancies. Multi-level marketing (MLM), pyramid schemes, or unverified commission-only gigs are strictly forbidden.</li>
            <li><strong className="text-slate-200">Zero Fee Guarantee:</strong> Employers and recruitment agencies are strictly prohibited from charging candidates any application, interview, training, or placement fees.</li>
            <li><strong className="text-slate-200">Non-Discrimination:</strong> Listings and selection processes must comply with international and local equal opportunity laws. Discrimination based on race, gender, age, disability, or religion is strictly prohibited.</li>
            <li><strong className="text-slate-200">Confidentiality:</strong> Applicant resumes and personal data accessed through JobMatrix may only be utilized for evaluating the applicant for the designated position.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: <Ban className="w-5 h-5 text-rose-400" />,
      title: "4. Strictly Prohibited Platform Activities",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            The following actions are considered serious violations and will trigger immediate account suspension and potential legal inquiry:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li>Automated scraping, crawling, or extracting applicant or job data via bots or third-party scrapers without written permission.</li>
            <li>Submitting automated bulk job applications or spamming hiring managers.</li>
            <li>Attempting to bypass security mechanisms, access controls, rate-limits, or reverse-engineer the ATS matching algorithms.</li>
            <li>Injecting malicious software, scripts, or corrupted files via resume uploads or profile fields.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      title: "5. Platform Role & Disclaimer of Employment",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            JobMatrix operates solely as a technological intermediary connecting candidates and hiring entities:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li>We do not guarantee job offers, interview scheduling, or candidate quality.</li>
            <li>Any employment contract, offer letter, salary agreement, or workplace condition is strictly negotiated between the candidate and employer.</li>
            <li>JobMatrix is not an employer, staffing agency, or labor broker with respect to listings posted on the platform.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-blue-400" />,
      title: "6. Account Termination & Contact",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            We reserve the right to suspend or terminate accounts that breach these terms or compromise platform security. Users may also close their account anytime via their account settings.
          </p>
          <p className="text-slate-400">
            Questions regarding our Terms of Service should be directed to our Legal Operations team at:{" "}
            <span className="text-blue-400 font-mono">legal@jobmatrix.dev</span>
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
            <Scale className="w-3.5 h-3.5" />
            <span>Terms & Governance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Please read these terms carefully before accessing JobMatrix. They establish the standards for fair, safe, and transparent hiring across our community.
          </p>
          <div className="mt-3 text-xs text-slate-500 font-mono">
            Effective Date: {lastUpdated} • Version 3.1
          </div>
        </div>

        {/* Highlight Summary Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/20 mb-10 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 shrink-0 mt-0.5">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Key Principle: Fair Hiring for Everyone
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Candidates must provide honest credentials, and employers must offer legitimate, fee-free employment. JobMatrix enforces zero tolerance for recruitment scams, ghost listings, or unauthorized data scraping.
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

export default TermsOfService;

