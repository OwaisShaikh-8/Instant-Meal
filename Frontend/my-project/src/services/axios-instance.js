import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/slice/auth-slice";
import toast from "react-hot-toast";
// ✅ Create instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:4002/api/",
  withCredentials: true,
});

// ✅ Request interceptor → attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor → success + error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // 🌟 Only show success for mutations (not GET requests)
    const method = response.config.method?.toLowerCase();
    const isMutation = ['post', 'put', 'patch', 'delete'].includes(method);
    
    if (isMutation && response.data?.message) {
        toast.success(`${response.data.message}`); // replace with toast
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    console.error("API Error:", error);
    
    // ✅ FIXED: Correct error path
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    // ❌ Show error alert
    toast.error(`${message}`);

    // 🔐 Auto logout on auth errors
    if (status === 401 || status === 403) {
      store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;