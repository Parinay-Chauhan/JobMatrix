export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship" | string;
export type WorkMode = "On-site" | "Hybrid" | "Remote" | string;
export type ExperienceLevel = "Entry-level" | "Mid-level" | "Senior-level" | string;
export type JobCategory =
  | "Software Development"
  | "Design"
  | "Marketing"
  | "Sales"
  | "Other"
  | string;

export interface JobRecruiterInfo {
  _id?: string;
  companyName?: string;
  companyLogo?: string;
  companyWebsite?: string;
  location?: string;
  industry?: string;
}

export interface Job {
  _id: string;
  title: string;
  description?: string;
  requirements?: string[];
  location?: string;
  jobType?: JobType;
  workMode?: WorkMode;
  category?: JobCategory;
  experienceLevel?: ExperienceLevel;
  salary?: number | string;
  positions?: number;
  isActive?: boolean;
  recruiter?: JobRecruiterInfo | string;
  companyName?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateJobPayload {
  title: string;
  description: string;
  requirements: string[];
  location: string;
  jobType: JobType;
  workMode: WorkMode;
  category: JobCategory;
  experienceLevel: ExperienceLevel;
  salary?: number;
  positions?: number;
}

export interface JobFilterParams {
  search?: string;
  keyword?: string;
  location?: string;
  jobType?: string;
  workMode?: string;
  category?: string;
  experienceLevel?: string;
  page?: number;
  limit?: number;
}
