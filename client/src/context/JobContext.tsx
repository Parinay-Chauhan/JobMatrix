import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useJobsQuery } from "../hooks/queries";
import type { Job } from "../types";

interface JobContextType {
  // Search and Filter States
  searchTitle: string;
  setSearchTitle: (value: string) => void;
  searchLocation: string;
  setSearchLocation: (value: string) => void;
  searchExperience: string;
  setSearchExperience: (value: string) => void;
  
  // Data States
  jobs: Job[];
  filteredJobs: Job[];
  loading: boolean;
  
  // Header / UI State
  isScrolled: boolean;
  
  // Handlers
  handlePopularSearch: (query: string) => void;
  clearFilters: () => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchExperience, setSearchExperience] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener for sticky floating header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch jobs using React Query
  const { data: jobs = [], isLoading: loading } = useJobsQuery();

  // Optimized filter computation
  const filteredJobs = useMemo(() => {
    const query = searchTitle.toLowerCase().trim();
    const locQuery = searchLocation.toLowerCase().trim();
    const expQuery = searchExperience.toLowerCase().trim();

    return jobs.filter((job) => {
      let matchesTitle = true;
      if (query) {
        matchesTitle =
          Boolean(job.title?.toLowerCase().includes(query)) ||
          Boolean(job.description?.toLowerCase().includes(query)) ||
          Boolean(job.jobType?.toLowerCase().includes(query)) ||
          Boolean(job.workMode?.toLowerCase().includes(query)) ||
          Boolean(job.category?.toLowerCase().includes(query)) ||
          Boolean(job.experienceLevel?.toLowerCase().includes(query)) ||
          Boolean(job.requirements?.some((r) => r.toLowerCase().includes(query))) ||
          (typeof job.recruiter === "object" &&
            Boolean(job.recruiter?.companyName?.toLowerCase().includes(query)));
      }

      let matchesLocation = true;
      if (locQuery) {
        matchesLocation =
          Boolean(job.location?.toLowerCase().includes(locQuery)) ||
          Boolean(job.workMode?.toLowerCase().includes(locQuery));
      }

      let matchesExperience = true;
      if (expQuery) {
        matchesExperience = job.experienceLevel?.toLowerCase() === expQuery;
      }

      return matchesTitle && matchesLocation && matchesExperience;
    });
  }, [jobs, searchTitle, searchLocation, searchExperience]);

  // Click on popular category tile
  const handlePopularSearch = (query: string) => {
    setSearchTitle(query);
    const jobsSection = document.getElementById("jobs");
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const clearFilters = () => {
    setSearchTitle("");
    setSearchLocation("");
    setSearchExperience("");
  };

  return (
    <JobContext.Provider
      value={{
        searchTitle,
        setSearchTitle,
        searchLocation,
        setSearchLocation,
        searchExperience,
        setSearchExperience,
        jobs,
        filteredJobs,
        loading,
        isScrolled,
        handlePopularSearch,
        clearFilters,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = (): JobContextType => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJobContext must be used within a JobProvider");
  }
  return context;
};
