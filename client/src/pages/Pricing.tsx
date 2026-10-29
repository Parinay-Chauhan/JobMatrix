import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Sparkles, Building2, UserCheck, ChevronRight } from "lucide-react";
import { HomeFooter } from "../components/home/HomeFooter";

export const Pricing: React.FC = () => {
  const [annualBilling, setAnnualBilling] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const candidateFeatures = [
    "Unlimited verified job applications",
    "Instant ATS resume match scoring",
    "Missing keyword suggestions & gap analysis",
    "Real-time application status telemetry",
    "Direct recruiter communication without brokers",
    "100% Free Forever with Zero Hidden Fees",
  ];

  const recruiterTiers = [
    {
      name: "Starter Trial",
      badge: "Free for Startups",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      price: "$0",
      period: "forever",
      description: "Ideal for early-stage founders making their first 1-2 core technical hires.",
      buttonText: "Start Free Hiring",
      buttonStyle: "bg-slate-900 hover:bg-slate-800 text-white border border-slate-700",
      link: "/register?role=recruiter",
      features: [
        "2 active verified job postings",
        "Up to 50 applicant profiles per role",
        "Basic ATS keyword filtering",
        "30-day listing lifespan",
        "Standard email notifications",
      ],
    },
    {
      name: "Growth Pro",
      badge: "Most Popular",
      badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      price: annualBilling ? "$79" : "$99",
      period: "per month",
      popular: true,
      description: "For scaling engineering teams hiring multiple developers simultaneously.",
      buttonText: "Upgrade to Pro",
      buttonStyle: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-md shadow-orange-500/25",
      link: "/register?role=recruiter",
      features: [
        "Unlimited active job postings",
        "Unlimited applicant profiles & downloads",
        "Advanced ATS scoring threshold filters",
        "Verified Employer Trust Badge",
        "Priority placement in 'Popular Searches'",
        "Real-time WebSocket applicant notifications",
        "Exportable candidate CSV & ATS webhooks",
      ],
    },
    {
      name: "Enterprise",
      badge: "Custom Scale",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      price: "Custom",
      period: "tailored billing",
      description: "Designed for high-growth enterprises and venture scale-ups with custom workflows.",
      buttonText: "Contact Enterprise Sales",
      buttonStyle: "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20",
      link: "/contact",
      features: [
        "Everything in Growth Pro",
        "Dedicated Talent Success Manager",
        "Custom ATS API integration & webhooks",
        "Single Sign-On (SAML / Okta SSO)",
        "Automated anti-fraud candidate verification",
        "Custom SLA with 4-hour support response",
      ],
    },
  ];

  const faqs = [
    {
      q: "Why is JobMatrix completely free for candidates?",
      a: "We believe talent should never be charged for finding employment. Candidates enjoy full access to resume uploads, ATS scoring, and job applications without paywalls or premium tiers.",
    },
    {
      q: "Can I cancel or change my recruiter subscription anytime?",
      a: "Yes. Recruiter subscriptions can be upgraded, downgraded, or canceled directly from your Recruiter Settings. If you cancel, your active listings will remain live until the end of your billing cycle.",
    },
    {
      q: "What payment methods are supported for recruiter plans?",
      a: "We accept all major credit and debit cards (Visa, Mastercard, American Express), bank transfers for annual contracts, and corporate invoicing for Enterprise customers.",
    },
  ];

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
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Predictable Pricing for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-orange-400 bg-clip-text text-transparent">
              High-Performing Teams
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Free forever for software engineers. Transparent, zero-commission recruitment subscriptions for ambitious companies.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1 rounded-2xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setAnnualBilling(false)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                !annualBilling
                  ? "bg-slate-800 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setAnnualBilling(true)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                annualBilling
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-orange-500 text-white">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Candidate Free Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/30 mb-16 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    For Job Seekers & Developers
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    100% Free
                  </span>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
                  JobMatrix never charges candidates for creating profiles, benchmarking resumes with our ATS engine, or applying to verified opportunities.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-xs text-slate-300">
                  {candidateFeatures.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/candidate/find-jobs"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-md shadow-orange-500/20 transition-all shrink-0 cursor-pointer"
            >
              <span>Explore Active Jobs</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Recruiter Pricing Cards */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-400 mb-2">
              <Building2 className="w-4 h-4" />
              <span>For Employers & Hiring Teams</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Recruiter & Company Subscriptions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {recruiterTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`p-6 sm:p-8 rounded-3xl bg-slate-900/60 border flex flex-col justify-between transition-all relative ${
                  tier.popular
                    ? "border-orange-500/50 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 shadow-2xl shadow-orange-500/10 md:-translate-y-2 ring-1 ring-orange-500/30"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {tier.name}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${tier.badgeColor}`}>
                      {tier.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    {tier.description}
                  </p>

                  <div className="mb-6 pb-6 border-b border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        {tier.price}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/{tier.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 text-xs text-slate-300">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={tier.link}
                  className={`w-full py-3 px-4 rounded-xl text-center text-xs sm:text-sm font-bold transition-all cursor-pointer ${tier.buttonStyle}`}
                >
                  {tier.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="border-t border-slate-800/80 pt-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Clear answers to common questions about billing, quotas, and cancellations.
            </p>
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

export default Pricing;
