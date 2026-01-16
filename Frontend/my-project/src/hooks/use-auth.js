import {
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation
} from "../services/auth-api.js"; // ✅ Import hooks directly
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCallback } from "react";

const useAuth = () => {
  const navigate = useNavigate();

  const loggedInUser = useSelector((state) => state.auth.user);
  const hasRoles = useSelector((state) => state.auth.hasRoles);

  const [login, {
    isLoading: isLoginLoading,
    isError: isLoginError,
    error: loginError
  }] = useLoginMutation();

  const [signup, {
    isLoading: isSignupLoading,
    isError: isSignupError,
    error: signupError
  }] = useSignupMutation();

  const [logout, {
    isLoading: isLogoutLoading,
    isError: isLogoutError,
    error: logoutError
  }] = useLogoutMutation();

  // 🔐 Login
  const loginUser = useCallback(async (data) => {
    try {
      const response = await login(data).unwrap();

      // ✅ Store in localStorage (backup for page refresh)
      localStorage.setItem("instantmeal", JSON.stringify(response));

      // ✅ Navigate based on role
      let targetRoute = "";

      if (response.user.role === "vendor") {
        if (response.hasRoles) {
          targetRoute = `/vendorhome`; // roles not set
          // targetRoute = "/admindashboard"; // roles are set

        } else {
          targetRoute = "/admindashboard"; // roles are set
        }
      } else {
        targetRoute = "/customerhome"; // customer flow
      }

      navigate(targetRoute);

      return response;
    } catch{
      // ✅ Error already handled by axios interceptor

    }
  }, [login, navigate]);

  // 📝 Signup
  const signupUser = useCallback(async (data) => {
    try {
      const response = await signup(data).unwrap();

      // ✅ Store in localStorage
      localStorage.setItem("instantmeal", JSON.stringify(response));

      // ✅ Navigate based on role
      const targetRoute = response.user.role === "vendor"
        ? "/vendorhome"
        : "/customerhome";

      navigate(targetRoute);

      return response;
    } catch  {
      // ✅ Error already handled by axios interceptor
    }
  }, [signup, navigate]);

  // 🚪 Logout
  const logoutUser = useCallback(async () => {
    try {
      await logout().unwrap();

      // ✅ Clear localStorage
      localStorage.removeItem("instantmeal");

      // ✅ Navigate to home
      navigate("/", { replace: true });
    } catch{
      // ✅ Even if API fails, clear local data (good UX)
      localStorage.removeItem("instantmeal");
      navigate("/", { replace: true });
    }
  }, [logout, navigate]);
 
  

  return {
    loggedInUser,
    hasRoles,
    loginUser,
    signupUser,
    logoutUser,

    // loading states
    isLoginLoading,
    isSignupLoading,
    isLogoutLoading,

    // error flags
    isLoginError,
    isSignupError,
    isLogoutError,

    // error objects (if needed for custom UI)
    loginError,
    signupError,
    logoutError,
  };
};

export default useAuth;
