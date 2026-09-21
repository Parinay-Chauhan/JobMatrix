import type { JobFilterParams } from "../types";

export const queryKeys = {
  // Jobs
  jobs: {
    all: ["jobs"] as const,
    list: (params?: JobFilterParams) => ["jobs", "list", params ?? {}] as const,
    detail: (id: string) => ["jobs", "detail", id] as const,
  },

  // Applications
  applications: {
    all: ["applications"] as const,
    mine: () => ["applications", "mine"] as const,
    jobApplicants: (jobId: string) => ["applications", "job", jobId] as const,
  },

  // Candidate
  candidate: {
    all: ["candidate"] as const,
    profile: () => ["candidate", "profile"] as const,
  },

  // Recruiter
  recruiter: {
    all: ["recruiter"] as const,
    jobs: () => ["recruiter", "jobs"] as const,
    stats: () => ["recruiter", "stats"] as const,
    profile: () => ["recruiter", "profile"] as const,
  },

  // Notifications
  notifications: {
    all: ["notifications"] as const,
  },
};

export default queryKeys;
