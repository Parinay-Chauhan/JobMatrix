import type { User } from "./auth";

export interface Experience {
  _id?: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  description?: string;
  location?: string;
}

export interface Education {
  _id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startYear?: number | string;
  endYear?: number | string;
}

export interface CandidateProfile {
  _id?: string;
  user?: User;
  phone?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  resume?: string;
  resumePublicId?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateCandidateProfilePayload {
  phone?: string;
  bio?: string;
  location?: string;
  skills?: string[] | string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}
