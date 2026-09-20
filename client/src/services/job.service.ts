import api from "../api/axios";
import type {
  Job,
  CreateJobPayload,
  JobFilterParams,
} from "../types";

export const jobService = {
  // Get all public jobs with query filters
  async getAllJobs(params?: JobFilterParams): Promise<Job[]> {
    const response = await api.get("/jobs", { params });
    const payload = response.data;
    const jobs =
      payload?.data?.jobs ||
      payload?.data ||
      payload?.jobs ||
      (Array.isArray(payload) ? payload : []);
    return jobs;
  },

  // Get job details by ID
  async getJobById(id: string): Promise<Job> {
    const response = await api.get(`/jobs/get/${id}`);
    const payload = response.data;
    return payload?.data?.job || payload?.data || payload?.job || payload;
  },

  // Get recruiter's posted jobs
  async getMyPostedJobs(): Promise<Job[]> {
    const response = await api.get("/jobs/my-jobs");
    const payload = response.data;
    const jobs =
      payload?.data?.jobs ||
      payload?.data ||
      payload?.jobs ||
      (Array.isArray(payload) ? payload : []);
    return jobs;
  },

  // Create new job posting (Recruiter)
  async postJob(payload: CreateJobPayload): Promise<Job> {
    const response = await api.post("/jobs", payload);
    const data = response.data;
    return data?.data?.job || data?.data || data?.job || data;
  },

  // Update existing job (Recruiter)
  async updateJob(id: string, payload: Partial<CreateJobPayload>): Promise<Job> {
    const response = await api.patch(`/jobs/${id}`, payload);
    const data = response.data;
    return data?.data?.job || data?.data || data?.job || data;
  },

  // Delete job (Recruiter)
  async deleteJob(id: string): Promise<void> {
    await api.delete(`/jobs/${id}`);
  },

  // Toggle active/inactive status (Recruiter)
  async toggleJobStatus(id: string): Promise<Job> {
    const response = await api.patch(`/jobs/toggle-status/${id}`);
    const data = response.data;
    return data?.data?.job || data?.data || data?.job || data;
  },
};

export default jobService;
