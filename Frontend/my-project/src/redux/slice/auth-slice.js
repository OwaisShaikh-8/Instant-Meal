// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// ✅ Load token + user from localStorage on app start
const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  hasRoles: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.hasRoles = action.payload.hasRoles;

      // ✅ Save to localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    logoutAction: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // ✅ Remove from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logoutAction } = authSlice.actions;
export default authSlice.reducer;
