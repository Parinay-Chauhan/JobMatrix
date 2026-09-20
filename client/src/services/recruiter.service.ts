import api from "../api/axios";
import type {
  ApiResponse,
  RecruiterProfile,
  RecruiterDashboardStats,
} from "../types";

export const recruiterService = {
  // Get recruiter profile
  async getProfile(): Promise<ApiResponse<RecruiterProfile>> {
    const response =
      await api.get<ApiResponse<RecruiterProfile>>("/recruiters/profile");
    return response.data;
  },

  // Create or Update recruiter profile
  async updateProfile(
    payload: Partial<RecruiterProfile>,
  ): Promise<ApiResponse<RecruiterProfile>> {
    const response = await api.patch<ApiResponse<RecruiterProfile>>(
      "/recruiters/profile",
      payload,
    );
    return response.data;
  },

  // Get aggregated dashboard analytics
  async getDashboardStats(): Promise<ApiResponse<RecruiterDashboardStats>> {
    const response = await api.get<ApiResponse<RecruiterDashboardStats>>(
      "/recruiters/dashboard/stats",
    );
    return response.data;
  },

  // Upload company logo
  async uploadLogo(file: File): Promise<ApiResponse<RecruiterProfile>> {
    const formData = new FormData();
    formData.append("logo", file);
    const response = await api.patch<ApiResponse<RecruiterProfile>>(
      "/recruiters/logo",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },
};
