import type { Job } from "./job";

export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "accepted"
  | "rejected"
  | string;

export interface ApplicantUser {
  _id: string;
  fullName?: string;
  fullname?: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface Application {
  _id: string;
  job: Job | string;
  applicant: ApplicantUser | string;
  candidate?: ApplicantUser;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt?: string;
}
