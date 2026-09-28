import axios, { type AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL as string) || "/api/v1",
  withCredentials: true,
});

// Request Interceptor: Attach Authorization Bearer token from localStorage if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Crucial for file uploads (FormData): Let browser/axios generate multipart/form-data with boundary
    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
      if (typeof (config.headers as any).delete === "function") {
        (config.headers as any).delete("Content-Type");
        (config.headers as any).delete("content-type");
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401s (Expired/Invalid Token) & Network Offline errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 1. Handle Expired / Invalid JWT Token (401 Unauthorized)
    if (error.response?.status === 401) {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        localStorage.removeItem("accessToken");
        // Dispatch event for reactive auth listeners
        window.dispatchEvent(new Event("auth:unauthorized"));
      }
    }

    // 2. Handle Backend Offline / Network Disconnect (No Response from Server)
    if (!error.response && error.request) {
      console.warn("⚠️ Network error or backend server unreachable.");
      if (error.message === "Network Error") {
        error.message = "Backend server is offline or unreachable. Please try again later.";
      }
    }

    return Promise.reject(error);
  }
);

export default api;