import {
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation
} from "../services/auth-api.js"; // ✅ Import hooks directly
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCallback } from "react";
import { resetMenu } from "../redux/slice/menu-slice.js";
import { resetOrders } from "../redux/slice/order-slice.js";
import { resetRoles } from "../redux/slice/roles-slice.js";
import { clearCart } from "../redux/slice/cart-slice.js";
import { resetRestaurants } from "../redux/slice/restaurant-slice.js";
import { logoutAction } from "../redux/slice/auth-slice.js";
const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
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

        } else {
          targetRoute = "/dashboard"; // roles are set
        }
      } else {
        targetRoute = "/customerhome"; // customer flow
      }

      navigate(targetRoute, { replace: true });

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
        ? "/dashboard"
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
      dispatch(logoutAction())
      dispatch(resetMenu())
      dispatch(resetOrders())
      dispatch(resetRoles())
      dispatch(clearCart())
      dispatch(resetRestaurants())
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
