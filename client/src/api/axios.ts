import axios, { type AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;








// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL as string,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;