// src/services/authApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axios-base-query.js";
import { setCredentials, logout } from "../redux/slice/auth-slice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({

    // 🔐 LOGIN
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        data: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          // Axios interceptor handles UI feedback
        }
      },
    }),

    // 📝 SIGNUP
    signup: builder.mutation({
      query: (userData) => ({
        url:
          userData.role === "customer"
            ? "auth/customersignin"
            : "auth/vendorsignin",
        method: "POST",
        data: userData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch  {
          // Axios interceptor handles UI feedback
        }
      },
    }),

    // 🚪 LOGOUT - FIXED VERSION
    logout: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled; // ✅ Wait for API response
          dispatch(logout());
        } catch  {
          // ✅ Logout locally even if server fails (good UX)
          dispatch(logout());
        }
      },
    }),

  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
} = authApi;
