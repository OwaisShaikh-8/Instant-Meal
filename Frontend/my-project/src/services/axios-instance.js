import axios from "axios";
import { store } from "../redux/store";
import toast from "react-hot-toast";


const axiosInstance = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://serene-gentleness-production.up.railway.app/api"
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

// ✅ Response interceptor → success + proper error handling
axiosInstance.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
    const isMutation = ["post", "put", "patch", "delete"].includes(method);

    if (isMutation && response.data?.message) {
      toast.success(String(response.data.message)); // force string
    }

    return response;
  },
  (error) => {
    console.error("API Error:", error);

    // Force message to always be string
    let message = "Something went wrong";

    if (error.response?.data?.message) {
      message = typeof error.response.data.message === "string"
        ? error.response.data.message
        : JSON.stringify(error.response.data.message); // convert object to string
    } else if (error.response?.data?.error) {
      message = typeof error.response.data.error === "string"
        ? error.response.data.error
        : JSON.stringify(error.response.data.error);
    } else if (error.message) {
      message = String(error.message);
    }

    toast.error(message);

    return Promise.reject(error);
  }
);

export default axiosInstance;
