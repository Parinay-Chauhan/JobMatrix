import api from "../api/axios";
import type { Application, ApplicationStatus } from "../types";

export const applicationService = {
  // Apply for a job (Candidate)
  async applyForJob(jobId: string): Promise<Application> {
    const response = await api.post(`/applications/apply/${jobId}`);
    const data = response.data;
    return data?.data?.application || data?.data || data?.application || data;
  },

  // Get logged-in candidate's applications
  async getMyApplications(): Promise<Application[]> {
    const response = await api.get("/applications/get");
    const payload = response.data;
    const apps =
      payload?.data?.applications ||
      payload?.data ||
      payload?.application ||
      (Array.isArray(payload) ? payload : []);
    return apps;
  },

  // Get applicants for a specific job (Recruiter)
  async getJobApplicants(jobId: string): Promise<Application[]> {
    const response = await api.get(`/applications/${jobId}/applicants`);
    const payload = response.data;
    const apps =
      payload?.data?.applications ||
      payload?.applications ||
      payload?.data?.applicants ||
      payload?.data ||
      (Array.isArray(payload) ? payload : []);
    return apps;
  },

  // Update applicant status (Recruiter)
  async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus
  ): Promise<Application> {
    const response = await api.patch(
      `/applications/status/${applicationId}`,
      { status }
    );
    const data = response.data;
    return data?.data?.application || data?.data || data?.application || data;
  },
};

export default applicationService;
