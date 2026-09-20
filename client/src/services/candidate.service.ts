import api from "../api/axios";
import type {
  ApiResponse,
  CandidateProfile,
  Experience,
  Education,
  UpdateCandidateProfilePayload,
} from "../types";

export const candidateService = {
  // Get candidate profile
  async getProfile(): Promise<ApiResponse<CandidateProfile>> {
    const response =
      await api.get<ApiResponse<CandidateProfile>>("/candidates/profile");
    return response.data;
  },

  // Update candidate profile
  async updateProfile(
    payload: UpdateCandidateProfilePayload,
  ): Promise<ApiResponse<CandidateProfile>> {
    const response = await api.patch<ApiResponse<CandidateProfile>>(
      "/candidates/profile",
      payload,
    );
    return response.data;
  },

  // Add work experience
  async addExperience(
    experience: Experience,
  ): Promise<ApiResponse<CandidateProfile>> {
    const response = await api.post<ApiResponse<CandidateProfile>>(
      "/candidates/experience",
      experience,
    );
    return response.data;
  },

  // Delete work experience
  async deleteExperience(
    experienceId: string,
  ): Promise<ApiResponse<CandidateProfile>> {
    const response = await api.delete<ApiResponse<CandidateProfile>>(
      `/candidates/experience/${experienceId}`,
    );
    return response.data;
  },

  // Add education
  async addEducation(
    education: Education,
  ): Promise<ApiResponse<CandidateProfile>> {
    const response = await api.post<ApiResponse<CandidateProfile>>(
      "/candidates/education",
      education,
    );
    return response.data;
  },

  // Delete education
  async deleteEducation(
    educationId: string,
  ): Promise<ApiResponse<CandidateProfile>> {
    const response = await api.delete<ApiResponse<CandidateProfile>>(
      `/candidates/education/${educationId}`,
    );
    return response.data;
  },

  // Upload Resume file
  async uploadResume(
    file: File,
  ): Promise<ApiResponse<CandidateProfile>> {
    const formData = new FormData();
    formData.append("resume", file);
    const response = await api.post<ApiResponse<CandidateProfile>>(
      "/candidates/resume",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  // Delete Resume file
  async deleteResume(): Promise<ApiResponse<CandidateProfile>> {
    const response = await api.delete<ApiResponse<CandidateProfile>>(
      "/candidates/resume",
    );
    return response.data;
  },
};
