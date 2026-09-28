import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

const baseURL = (import.meta.env.VITE_API_BASE_URL as string) || "/api/v1";

const api: AxiosInstance = axios.create({
  baseURL,
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

// Queue for holding requests while token is refreshing
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle 401s (Expired/Invalid Token) & Network Offline errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean });

    // 1. Handle Expired / Invalid JWT Token (401 Unauthorized)
    if (error.response?.status === 401 && originalRequest) {
      const isAuthEndpoint =
        originalRequest.url?.includes("/users/login") ||
        originalRequest.url?.includes("/users/register") ||
        originalRequest.url?.includes("/users/refresh-token");

      // If 401 is on login/register/refresh endpoint or already retried, fail and logout
      if (isAuthEndpoint || originalRequest._retry) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.dispatchEvent(new Event("auth:unauthorized"));
        return Promise.reject(error);
      }

      // If another request is currently refreshing the token, wait for it
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const storedRefreshToken = localStorage.getItem("refreshToken");

      try {
        // Call refresh endpoint using raw axios instance to prevent recursive interceptors
        const refreshResponse = await axios.post(
          `${baseURL}/users/refresh-token`,
          { refreshToken: storedRefreshToken || undefined },
          { withCredentials: true }
        );

        const newAccessToken =
          refreshResponse.data?.data?.accessToken || refreshResponse.data?.accessToken;
        const newRefreshToken =
          refreshResponse.data?.data?.refreshToken || refreshResponse.data?.refreshToken;

        if (!newAccessToken) {
          throw new Error("No access token returned from refresh endpoint");
        }

        // Store refreshed tokens
        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Attach new token to original request and process queued requests
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.dispatchEvent(new Event("auth:unauthorized"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
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