import React from "react";

interface Testimonial {
  initials: string;
  bg: string;
  name: string;
  role: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    initials: "RK",
    bg: "bg-orange-500",
    name: "Rishi Kant",
    role: "BBA Student",
    text: "Found my first internship through JobMatrix within 2 weeks of signing up. The listings are genuinely fresh and the apply process is super clean. Highly recommend to anyone just starting out.",
  },
  {
    initials: "CA",
    bg: "bg-red-500",
    name: "Chirag Arora",
    role: "Software Engineer at Bosch",
    text: "Got placed at Bosch through a listing I found here. The job descriptions were honest and detailed — no misleading salary ranges. Exactly what job seekers need.",
  },
  {
    initials: "AN",
    bg: "bg-teal-500",
    name: "Anshika Aggarwal",
    role: "1.5 YOE as MTS",
    text: "JobMatrix helped me land my first full-time role after college. The remote filters are really useful. I found a hybrid role that perfectly matched my expectations.",
  },
  {
    initials: "AT",
    bg: "bg-emerald-600",
    name: "Anuj Thakur",
    role: "Data Analyst at Scaler",
    text: "I was skeptical but after applying through JobMatrix I got 3 interview calls in a single week. The search actually works — no irrelevant junk showing up.",
  },
  {
    initials: "RS",
    bg: "bg-teal-600",
    name: "Rohan Kumar Sah",
    role: "Software Engineer",
    text: "Clean, fast, and straightforward. I love how you can filter by work mode instantly. Found a remote backend role that fit my skills exactly within days.",
  },
  {
    initials: "BB",
    bg: "bg-emerald-600",
    name: "Bhavya Bhalla",
    role: "Student",
    text: "As a fresher I was worried no one would respond. But JobMatrix actually showed me entry-level listings and I landed an internship at a startup within 10 days!",
  },
  {
    initials: "NJ",
    bg: "bg-cyan-600",
    name: "Nidhi Juneja",
    role: "SDE Intern",
    text: "The part-time section is gold. I found a remote content writing gig that fits perfectly with my college schedule. Didn't have to scroll endlessly like other sites.",
  },
  {
    initials: "RA",
    bg: "bg-amber-600",
    name: "Raj Shrivastava",
    role: "Assistant System Engineer at TCS",
    text: "JobMatrix made my job switch incredibly smooth. Filters by experience level and location saved me hours. I got an offer from TCS within 3 weeks of active searching.",
  },
  {
    initials: "RH",
    bg: "bg-pink-600",
    name: "Rahul Verma",
    role: "Web Developer",
    text: "I've been on Naukri and LinkedIn but JobMatrix gave me better quality matches for my skills. The UI is honestly the best I've seen among Indian job portals.",
  },
  {
    initials: "PS",
    bg: "bg-cyan-600",
    name: "Priya Sharma",
    role: "UX Designer",
    text: "Found a women-friendly startup through the 'Jobs for Women' section. The company was exactly as described. No bait-and-switch on salary either. 10/10 experience.",
  },
  {
    initials: "MK",
    bg: "bg-rose-600",
    name: "Mohit Kumar",
    role: "DevOps Engineer",
    text: "Got a cloud engineer role at a funded startup in Pune. The description was accurate and the recruiter responded within 24 hours. That never happens on other platforms.",
  },
  {
    initials: "SR",
    bg: "bg-emerald-600",
    name: "Sneha Rawat",
    role: "HR at Infosys",
    text: "We use JobMatrix to post openings and the quality of candidates is noticeably better. The talent pool is serious about job hunting — not just browsing.",
  },
  {
    initials: "VB",
    bg: "bg-teal-600",
    name: "Vikram Bansal",
    role: "Full Stack Developer",
    text: "Switched from a service company to a product startup using JobMatrix. The remote filter and tech stack search is incredibly precise. Super happy with my move.",
  },
  {
    initials: "DM",
    bg: "bg-orange-600",
    name: "Divya Mehta",
    role: "Marketing Manager",
    text: "Found a marketing lead role through JobMatrix in my city. The salary range shown was accurate to what was offered. Transparent and reliable — rare in job portals.",
  },
  {
    initials: "AJ",
    bg: "bg-sky-600",
    name: "Arjun Joshi",
    role: "Backend Engineer",
    text: "Three months after graduating I was worried. But JobMatrix had freshers-specific listings that actually responded. Got placed as a backend trainee. Best decision ever.",
  },
  {
    initials: "KR",
    bg: "bg-teal-500",
    name: "Kavita Rao",
    role: "QA Engineer at Wipro",
    text: "Part-time remote QA role — something I thought was impossible to find. JobMatrix had exactly that. Now I work 4 hours a day from home and it's changed my life.",
  },
  {
    initials: "SM",
    bg: "bg-emerald-600",
    name: "Suresh Mishra",
    role: "Product Manager",
    text: "Used JobMatrix to hire for two product roles at our startup. The quality of applications was far better than what we got on LinkedIn for the same JD.",
  },
  {
    initials: "LK",
    bg: "bg-red-600",
    name: "Lalit Kumawat",
    role: "SDE-2 at Paytm",
    text: "Switched jobs twice through JobMatrix in 2 years. Both times the hiring process was smooth and the job exactly as described. My go-to platform now.",
  },
];

const row1 = testimonials.slice(0, 6);
const row2 = testimonials.slice(6, 12);
const row3 = testimonials.slice(12, 18);

const TestimonialCard: React.FC<{ t: Testimonial }> = ({ t }) => (
  <div className="shrink-0 w-[300px] sm:w-[320px] bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-5 cursor-default select-none transition-colors duration-200">
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${t.bg}`}>
        {t.initials}
      </div>
      <div>
        <p className="text-white text-sm font-semibold leading-tight">{t.name}</p>
        <p className="text-slate-400 text-xs">{t.role}</p>
      </div>
    </div>
    <p className="text-slate-300 text-[13px] leading-relaxed line-clamp-4">{t.text}</p>
  </div>
);

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="bg-slate-950 py-16 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          What Others Are Saying
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
          Real stories from people who've experienced the journey firsthand — their wins, growth, and transformations speak louder than we ever could.
        </p>
      </div>

      <div className="space-y-4">
        {/* Row 1 — Right to Left */}
        <div className="flex overflow-hidden select-none w-full">
          <div className="animate-marquee flex items-stretch gap-4 shrink-0 pr-4">
            {[...row1, ...row1, ...row1, ...row1].map((t, i) => (
              <TestimonialCard key={`r1-${i}`} t={t} />
            ))}
          </div>
        </div>

        {/* Row 2 — Left to Right */}
        <div className="flex overflow-hidden select-none w-full">
          <div className="animate-marquee-reverse flex items-stretch gap-4 shrink-0 pr-4">
            {[...row2, ...row2, ...row2, ...row2].map((t, i) => (
              <TestimonialCard key={`r2-${i}`} t={t} />
            ))}
          </div>
        </div>

        {/* Row 3 — Right to Left (slow) */}
        <div className="flex overflow-hidden select-none w-full">
          <div className="animate-marquee-slow flex items-stretch gap-4 shrink-0 pr-4">
            {[...row3, ...row3].map((t, i) => (
              <TestimonialCard key={`r3-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


