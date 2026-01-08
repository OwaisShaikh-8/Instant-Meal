import { 
  useLoginMutation, 
  useLogoutMutation, 
  useSignupMutation 
} from "../services/auth-api.js"; // ✅ Import hooks directly
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const navigate = useNavigate();

  // ✅ Use hooks directly (no destructuring from authApi)
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
  const loginUser = async (data) => {
    try {
      const response = await login(data).unwrap();
      console.log(data);
      
      // ✅ Store in localStorage (backup for page refresh)
      localStorage.setItem("instantmeal", JSON.stringify(response));

      // ✅ Navigate based on role
      const targetRoute = response.user.role === "vendor" 
        ? "/vendorhome" 
        : "/customerhome";
      
      navigate(targetRoute);

      return response;
    } catch (error) {
      // ✅ Error already handled by axios interceptor (alert shown)
      // Just re-throw so caller knows it failed
      // throw error;
    }
  };

  // 📝 Signup
  const signupUser = async (data) => {
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
    } catch (error) {
      // ✅ Error already handled by axios interceptor
      // throw error;
    }
  };

  // 🚪 Logout
  const logoutUser = async () => {
    try {
      await logout().unwrap();
      
      // ✅ Clear localStorage
      localStorage.removeItem("instantmeal");
      
      // ✅ Navigate to home
      navigate("/", { replace: true });
    } catch (error) {
      // ✅ Even if API fails, clear local data (good UX)
      localStorage.removeItem("instantmeal");
      navigate("/", { replace: true });
    }
  };

  return {
    // actions
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