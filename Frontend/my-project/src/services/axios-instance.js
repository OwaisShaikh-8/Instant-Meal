import axios from "axios";
import { store } from "../redux/store";
import toast from "react-hot-toast";

// ✅ Decide baseURL dynamically
const BASE_URL =
    ["http://localhost:5000/api", "https://serene-gentleness-production.up.railway.app/api"]

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // ❌ withCredentials removed because you use Bearer token
});

// ✅ Request interceptor → attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      store.getState().auth.token || localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
    const isMutation = ["post", "put", "patch", "delete"].includes(method);

    if (isMutation && response.data?.message) {
      toast.success(response.data.message);
    }

    return response;
  },
  (error) => {
    console.error("API Error:", error);

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    toast.error(message);

    return Promise.reject(error);
  }
);

export default axiosInstance;
