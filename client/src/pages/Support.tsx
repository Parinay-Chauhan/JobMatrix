import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, HelpCircle, Search, ChevronDown, MessageSquare } from "lucide-react";
import { HomeFooter } from "../components/home/HomeFooter";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const Support: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs: FAQItem[] = [
    {
      category: "Resume & ATS",
      question: "How does the ATS Match Score calculate my percentage?",
      answer:
        "The JobMatrix ATS engine analyzes the exact hard technical skills, tools, programming languages, and years of experience stated in the recruiter's job description. It cross-references your uploaded resume tokens and awards points for exact matches, related synonyms, and quantified achievements. You also receive an actionable list of missing keywords.",
    },
    {
      category: "Resume & ATS",
      question: "What resume file formats are supported?",
      answer:
        "We support standard PDF (.pdf) and Microsoft Word (.docx) files up to 5MB in size. We recommend single-column text-based PDFs generated directly from LaTeX, Google Docs, or Word for optimal parsing accuracy.",
    },
    {
      category: "Applications",
      question: "What do the different application status badges mean?",
      answer:
        "• Pending: Your application has been dispatched and is awaiting initial recruiter review.\n• Reviewed: The recruiter has opened your profile and parsed your resume.\n• Shortlisted: You have passed the initial screen and your profile is flagged for team interviews.\n• Accepted / Closed: The vacancy has progressed to formal offer or has been concluded.",
    },
    {
      category: "Applications",
      question: "Can I edit my resume after submitting an application?",
      answer:
        "You can update your master resume in Candidate Profile at any time for all future applications. However, previously submitted applications retain the exact resume snapshot captured at the moment you clicked 'Apply' so recruiters see the version you originally submitted.",
    },
    {
      category: "Recruiters",
      question: "How do recruiters verify company credentials on JobMatrix?",
      answer:
        "Every recruiter must register using an official corporate domain email address (free public webmail providers like @gmail or @yahoo are disallowed for recruiter accounts). Listings are verified against corporate registries to eliminate ghost jobs and placement fee scams.",
    },
    {
      category: "Account & Security",
      question: "How do I permanently delete my account and data?",
      answer:
        "Under our GDPR/CCPA data sovereignty commitment, you can initiate complete account erasure from Candidate Settings. This permanently purges your login credentials, uploaded resume documents, ATS caches, and application records from our databases.",
    },
    {
      category: "Account & Security",
      question: "Why was my session automatically logged out?",
      answer:
        "JobMatrix uses automatic cryptographic refresh token rotation. If your session is left idle, or if any suspicious concurrent IP or token reuse is detected, the security engine immediately invalidates the session family to safeguard your personal documents.",
    },
  ];

  const categories = ["All", "Resume & ATS", "Applications", "Recruiters", "Account & Security"];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Sticky Top Header */}
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
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support & Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            How Can We Assist <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400 bg-clip-text text-transparent">
              Your Job Search Today?
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Find immediate answers regarding resume parsing, ATS scoring thresholds, recruiter verification, and application status workflows.
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by keyword (e.g. ATS, status badges, delete account)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-800 bg-slate-900 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/80 transition-all shadow-xl"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 mb-16">
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No matching troubleshooting topics found for "{searchQuery}". Need hands-on help? Contact our desk below.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
                        isOpen ? "rotate-180 text-blue-400" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 whitespace-pre-line">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Direct Contact Escalation Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Still Need Dedicated Assistance?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg">
              Our engineering and candidate operations teams are on standby to resolve technical issues and account inquiries.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Support Desk</span>
            </Link>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
};

export default Support;
