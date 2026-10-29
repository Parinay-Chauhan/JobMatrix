import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MessageSquare, Building2, Shield, Send, CheckCircle2, HelpCircle } from "lucide-react";
import { HomeFooter } from "../components/home/HomeFooter";

export const Contact: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    category: "Candidate Support",
    message: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate immediate smooth feedback
    setTimeout(() => {
      setLoading(false);
      setFormSubmitted(true);
    }, 700);
  };

  const contactChannels = [
    {
      icon: <Mail className="w-5 h-5 text-blue-400" />,
      title: "Candidate Support",
      email: "candidates@jobmatrix.dev",
      description: "Assistance with account setup, resume parsing, and application status questions.",
    },
    {
      icon: <Building2 className="w-5 h-5 text-orange-400" />,
      title: "Recruiter & Enterprise",
      email: "recruiting@jobmatrix.dev",
      description: "Corporate job posting quotas, custom ATS integrations, and enterprise talent pipelines.",
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      title: "Security & Compliance",
      email: "security@jobmatrix.dev",
      description: "Bug bounty disclosures, authentication integrity, and GDPR/CCPA data requests.",
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-sky-400" />,
      title: "Press & Media",
      email: "press@jobmatrix.dev",
      description: "Media inquiries, podcast guesting, brand assets, and official platform commentary.",
    },
  ];

  const faqs = [
    {
      q: "How quickly will I receive a response?",
      a: "Our support operations run across multiple global timezones. Standard candidate inquiries are answered within 12-24 hours, while urgent enterprise support is addressed in under 4 hours.",
    },
    {
      q: "Is JobMatrix completely free for job seekers?",
      a: "Yes, 100%. Candidates never pay for resume uploads, ATS keyword scoring, job applications, or interview scheduling. We have a strict zero-fee policy.",
    },
    {
      q: "How can my company start posting verified vacancies?",
      a: "Simply sign up with your verified corporate work email address, complete company domain verification, and access your recruiter dashboard instantly.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Sticky Header */}
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
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Mail className="w-3.5 h-3.5" />
            <span>We're Here to Help</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Connect with the <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400 bg-clip-text text-transparent">
              JobMatrix Team
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Have a question about your candidate profile, need assistance posting a role, or want to partner with us? Drop us a note below.
          </p>
        </div>

        {/* 2-Column Grid: Form on Left + Channel Cards on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20">
          {/* Form Card (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl">
            {formSubmitted ? (
              <div className="py-12 px-4 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Message Dispatched Successfully
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{formData.fullName}</strong>. Your ticket has been routed to our <span className="text-blue-400 font-semibold">{formData.category}</span> desk. We typically reply within 12 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ fullName: "", email: "", category: "Candidate Support", message: "" });
                  }}
                  className="mt-4 px-5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight mb-1">
                    Send Us an Inquiry
                  </h3>
                  <p className="text-xs text-slate-400">
                    Fill out the fields below and our operations engineers will get right back to you.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/80 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/80 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/80 transition-all cursor-pointer"
                  >
                    <option value="Candidate Support">Candidate Support & Resume Help</option>
                    <option value="Recruiter Onboarding">Recruiter Onboarding & Job Quotas</option>
                    <option value="Technical Bug Report">Technical Bug Report & Security</option>
                    <option value="Partnership / Press">Partnership, API & Press</option>
                    <option value="Other">Other / General Feedback</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Message Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can our team assist you today?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/80 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transmit Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Info Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {contactChannels.map((c, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    {c.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {c.title}
                    </h4>
                    <a
                      href={`mailto:${c.email}`}
                      className="text-xs font-mono text-blue-400 hover:underline"
                    >
                      {c.email}
                    </a>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed mt-2">
                  {c.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="border-t border-slate-800/80 pt-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-orange-400" />
              <span>Frequently Addressed Topics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Quick Answers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2.5"
              >
                <h4 className="text-sm font-bold text-white tracking-tight">
                  {faq.q}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
};

export default Contact;

