import React from "react";

export const CompanyMarquee: React.FC = () => {
  const baseCompanies = [
    {
      name: "Google",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      ),
    },
    {
      name: "TCS",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#007ACC">
          <circle cx="12" cy="12" r="10" fill="#0A3A60" />
          <text x="12" y="16" fontSize="9" fontWeight="900" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif">TCS</text>
        </svg>
      ),
    },
    {
      name: "Microsoft",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#F25022" d="M1 1h10v10H1z" />
          <path fill="#00A4EF" d="M1 13h10v10H1z" />
          <path fill="#7FBA00" d="M13 1h10v10H13z" />
          <path fill="#FFB900" d="M13 13h10v10H13z" />
        </svg>
      ),
    },
    {
      name: "Infosys",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <rect width="24" height="24" rx="5" fill="#007CC3" />
          <text x="12" y="16.5" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif">Infy</text>
        </svg>
      ),
    },
    {
      name: "Amazon",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FF9900">
          <path d="M13.95 10.98c-1.77 0-3.32.33-4.3.93-.9.55-1.12 1.34-1.12 2.14 0 1.55 1.05 2.5 2.65 2.5 1.35 0 2.45-.63 3.12-1.73l-.35.98h2.05v-5.6h-2.05v.78zm-.3 4.25c-.75 0-1.63-.35-1.63-1.4 0-1.12.98-1.5 2.05-1.5.88 0 1.3.15 1.63.3v1.3c-.45.83-1.25 1.3-2.05 1.3z" />
          <path d="M21.72 18.28c-3.1 2.3-7.53 3.52-11.45 3.52-5.48 0-10.42-2.12-14.17-5.67-.3-.28-.03-.68.33-.48 4.05 2.37 9.05 3.78 14.2 3.78 3.53 0 7.42-.92 10.95-2.82.52-.3 1.05.28.14.67z" />
        </svg>
      ),
    },
    {
      name: "Accenture",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#A100FF">
          <path d="M1.5 17.5L14 12 1.5 6.5l2.2-4.5L22.5 12 3.7 22l-2.2-4.5z" />
        </svg>
      ),
    },
    {
      name: "Meta",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0668E1">
          <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
        </svg>
      ),
    },
    {
      name: "Wipro",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#000000" stroke="#7CB342" strokeWidth="2" />
          <circle cx="8" cy="10" r="2.5" fill="#E91E63" />
          <circle cx="16" cy="10" r="2.5" fill="#FF9800" />
          <circle cx="12" cy="15" r="2.5" fill="#2196F3" />
        </svg>
      ),
    },
    {
      name: "Apple",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FFFFFF">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.13.65-2.79 1.43-.58.67-1.1 1.74-1.01 2.78 1.08.08 2.18-.59 2.79-1.34z" />
        </svg>
      ),
    },
    {
      name: "Cognizant",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0033A0">
          <rect width="24" height="24" rx="5" fill="#0033A0" />
          <path d="M17 7h-6.5C8 7 6 9 6 11.5s2 4.5 4.5 4.5H17v-2.5h-6.5c-1.1 0-2-.9-2-2s.9-2 2-2H17V7z" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      name: "Netflix",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#E50914">
          <path d="M4 0v24l6-3.5V0H4zm10 0v16.5l6 3.5V0h-6z" />
        </svg>
      ),
    },
    {
      name: "Capgemini",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0070AD">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.8 0-4.5-1.7-4.5-4.5s1.7-4.5 4.5-4.5c1.4 0 2.5.5 3.3 1.3l-1.4 1.4c-.5-.5-1.1-.8-1.9-.8-1.7 0-2.6 1.1-2.6 2.6s.9 2.6 2.6 2.6c.8 0 1.4-.3 1.9-.8l1.4 1.4c-.8.8-1.9 1.3-3.3 1.3z" />
        </svg>
      ),
    },
    {
      name: "Uber",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FFFFFF">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
        </svg>
      ),
    },
    {
      name: "HCLTech",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <rect width="24" height="24" rx="5" fill="#00358E" />
          <text x="12" y="16" fontSize="9" fontWeight="900" textAnchor="middle" fill="#00A3E0" fontFamily="sans-serif">HCL</text>
        </svg>
      ),
    },
    {
      name: "Spotify",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1DB954">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      ),
    },
    {
      name: "IBM",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0F62FE">
          <path d="M2 5h6v2H2zm0 4h6v2H2zm0 4h6v2H2zm0 4h6v2H2zm7-12h6v2H9zm0 4h6v2H9zm0 4h6v2H9zm0 4h6v2H9zm7-12h6v2h-6zm0 4h6v2h-6zm0 4h6v2h-6zm0 4h6v2h-6z" />
        </svg>
      ),
    },
    {
      name: "Airbnb",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FF5A5F">
          <path d="M12 0C7.2 0 4.5 3.3 4.5 7.1c0 3.8 2.8 8.1 7.5 13.9 4.7-5.8 7.5-10.1 7.5-13.9C19.5 3.3 16.8 0 12 0zm0 10.5c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" />
        </svg>
      ),
    },
    {
      name: "Deloitte",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <rect width="24" height="24" rx="5" fill="#111827" />
          <text x="10" y="16.5" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif">D</text>
          <circle cx="18" cy="15.5" r="2.5" fill="#86BC25" />
        </svg>
      ),
    },
    {
      name: "Stripe",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#635BFF">
          <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697.5 12.334.5 6.456.5 2.37 3.543 2.37 8.35c0 6.643 9.18 5.617 9.18 8.497 0 .984-.872 1.487-2.274 1.487-2.658 0-5.59-1.233-7.534-2.375L.768 21.49C2.793 22.84 5.922 23.5 9.18 23.5c6.24 0 10.516-2.923 10.516-7.859 0-7.078-9.456-5.882-9.456-8.528 0-.963.856-1.463 2.222-1.463 2.062 0 4.545.92 5.514 1.5z" />
        </svg>
      ),
    },
    {
      name: "Oracle",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#F80000">
          <rect width="24" height="24" rx="5" fill="#1e293b" />
          <path d="M12 7c-3.3 0-6 2.2-6 5s2.7 5 6 5 6-2.2 6-5-2.7-5-6-5zm0 8c-2.2 0-4-1.3-4-3s1.8-3 4-3 4 1.3 4 3-1.8 3-4 3z" fill="#F80000" />
        </svg>
      ),
    },
  ];

  // Repeat items to ensure smooth continuous flow on wide displays
  const trackItems = [...baseCompanies, ...baseCompanies];

  return (
    <section
      id="companies"
      className="relative overflow-hidden bg-slate-950/80 border-t border-slate-800/60 pt-4 pb-6 sm:pt-5 sm:pb-7 w-full z-10 shrink-0"
    >
      {/* Edge gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-l from-slate-950 via-slate-950/90 to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 mb-3 sm:mb-4 text-center">
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-400/90 flex items-center justify-center gap-3 sm:gap-4">
          <span className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-emerald-500/50" />
          <span>Top Tech & Service Leaders Hiring on JobMatrix</span>
          <span className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-emerald-500/50" />
        </p>
      </div>

      {/* Infinite Seamless Marquee Track */}
      <div className="marquee-container flex overflow-hidden select-none w-full">
        {/* Track 1 */}
        <div className="animate-marquee flex items-center gap-10 sm:gap-16 shrink-0 pr-10 sm:pr-16">
          {trackItems.map((company, index) => (
            <div
              key={`t1-${company.name}-${index}`}
              className="flex items-center gap-3 opacity-75 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer shrink-0 group select-none py-1"
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {company.icon}
              </div>
              <span className="text-base sm:text-lg font-extrabold text-slate-200 group-hover:text-emerald-300 tracking-tight transition-colors">
                {company.name}
              </span>
            </div>
          ))}
        </div>

        {/* Track 2 (Duplicate for continuous loop with zero gap) */}
        <div className="animate-marquee flex items-center gap-10 sm:gap-16 shrink-0 pr-10 sm:pr-16" aria-hidden="true">
          {trackItems.map((company, index) => (
            <div
              key={`t2-${company.name}-${index}`}
              className="flex items-center gap-3 opacity-75 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer shrink-0 group select-none py-1"
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {company.icon}
              </div>
              <span className="text-base sm:text-lg font-extrabold text-slate-200 group-hover:text-emerald-300 tracking-tight transition-colors">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

