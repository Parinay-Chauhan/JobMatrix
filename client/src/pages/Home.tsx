import React from "react";
import { JobProvider } from "../context/JobContext";
import {
  FloatingHeader,
  HeroSection,
  CompanyMarquee,
  StatsSection,
  PopularSearches,
  ExperienceTimeline,
  JobListingsSection,
  TestimonialsSection,
  RecruiterCtaSection,
  HomeFooter,
} from "../components/home";

/**
 * Home Page - Main landing page orchestrator
 * Designed with a high-end Vercel/Linear dark SaaS aesthetic, clean natural section hierarchy,
 * refined stats metrics, and airy experience pathway cards.
 */
export const Home: React.FC = () => {
  return (
    <JobProvider>
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-blue-500/20 selection:text-blue-200">
        <FloatingHeader />
        <HeroSection />
        <CompanyMarquee />
        <StatsSection />
        <PopularSearches />
        <ExperienceTimeline />
        <JobListingsSection />
        <TestimonialsSection />
        <RecruiterCtaSection />
        <HomeFooter />
      </div>
    </JobProvider>
  );
};

export default Home;
