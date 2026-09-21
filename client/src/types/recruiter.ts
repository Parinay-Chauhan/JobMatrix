import type { User } from "./auth";

export interface RecruiterProfile {
  _id?: string;
  user?: User;
  companyName: string;
  companyWebsite?: string;
  companyDescription?: string;
  companyLogo?: string;
  logoPublicId?: string;
  location?: string;
  industry?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecruiterDashboardStats {
  jobs: {
    total: number;
    active: number;
    closed: number;
  };
  applications: {
    totalApplications: number;
    pending: number;
    reviewed: number;
    accepted: number;
    rejected: number;
  };
}
