import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axios-base-query";
import {
  setActiveRole,
  setAllRoles,
  resetRoles,
} from "../redux/slice/roles-slice.js";

export const rolesApi = createApi({
  reducerPath: "rolesApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({

    // 🔹 GET USER ROLES
    getRoles: builder.query({
      query: () => ({
        url: "roles/getRoles",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAllRoles(data.allRoles));
        } catch {
          // handled globally
        }
      },
    }),

    // 🔹 CREATE ROLES
    createRoles: builder.mutation({
      query: (rolesData) => ({
        url: "roles/create",
        method: "POST",
        data: rolesData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // assume backend returns updated roles list
          dispatch(setAllRoles(data.allRoles));
        } catch {
          // handled globally
        }
      },
    }),

    // 🔹 SWITCH ROLE
    switchRole: builder.mutation({
      query: (role) => ({
        url: "roles/switch",
        method: "POST",
        data: { role },
      }),
      async onQueryStarted(role, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setActiveRole(role));
        } catch {
          // rollback if needed
        }
      },
    }),

    // 🔹 CLEAR ROLES (LOCAL ONLY)
    clearRoles: builder.mutation({
      queryFn: async () => ({ data: null }),
      async onQueryStarted(_, { dispatch }) {
        dispatch(resetRoles());
      },
    }),

  }),
});

export const {
  useGetRolesQuery,
  useCreateRolesMutation,
  useSwitchRoleMutation,
  useClearRolesMutation,
} = rolesApi;
