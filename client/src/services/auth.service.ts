import api from "../api/axios";
import type {
  ApiResponse,
  User,
  LoginPayload,
  RegisterPayload,
  AuthResponseData,
} from "../types";

export const authService = {
  async register(payload: RegisterPayload): Promise<ApiResponse<User>> {
    const response = await api.post<ApiResponse<User>>(
      "/users/register",
      payload,
    );
    return response.data;
  },

  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> {
    const response = await api.post<ApiResponse<AuthResponseData>>(
      "/users/login",
      payload,
    );
    return response.data;
  },

  async logout(): Promise<ApiResponse<Record<string, never>>> {
    const response = await api.post<ApiResponse<Record<string, never>>>(
      "/users/logout",
    );
    return response.data;
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>("/users/current-user");
    return response.data;
  },

  async updateAvatar(file: File): Promise<ApiResponse<User>> {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await api.patch<ApiResponse<User>>("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
