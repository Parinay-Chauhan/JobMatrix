import React from "react";
import { JobProvider } from "../context/JobContext";
import {
  FloatingHeader,
  HeroSection,
  CompanyMarquee,
  PopularSearches,
  JobListingsSection,
  TestimonialsSection,
  RecruiterCtaSection,
  HomeFooter,
} from "../components/home";

/**
 * Home Page - Main landing page orchestrator
 * Decoupled using React Context API (JobProvider) and modular sub-components.
 * Perfect for clean architecture and portfolio presentation.
 */
export const Home: React.FC = () => {
  return (
    <JobProvider>
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
        <FloatingHeader />
        <HeroSection />
        <CompanyMarquee />
        <PopularSearches />
        <JobListingsSection />
        <TestimonialsSection />
        <RecruiterCtaSection />
        <HomeFooter />
      </div>
    </JobProvider>
  );
};

export default Home;
