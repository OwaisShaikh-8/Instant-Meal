import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axios-base-query";
import {
  setActiveRole,
  setAllRoles,
} from "../redux/slice/roles-slice.js";

export const rolesApi = createApi({
  reducerPath: "rolesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Roles', 'ActiveRole'],
  endpoints: (builder) => ({

    // 🔹 GET USER ROLES
    getRoles: builder.query({
      query: (userId) => ({
        url: "roles/get",
        method: "GET",
        params: {id : userId}
      }),
      providesTags: ['Roles'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAllRoles(data.allRoles));
        } catch {
          // ✅ Error handled by axios interceptor
        }
      },
      
    }),

    // 🔹 CREATE ROLE
    createRoles: builder.mutation({
      query: (rolesData) => ({
        url: "roles/create",
        method: "POST",
        data: rolesData,
      }),
      invalidatesTags: ['Roles'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAllRoles(data.allRoles));
        } catch {
          // ✅ Error handled by axios interceptor
        }
      },
    }),

  
   

    // 🔹 DELETE ROLE
    deleteRole: builder.mutation({
      query: (roleId) => ({
        url: `roles/delete/${roleId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Roles'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAllRoles(data.allRoles));
        } catch {
          // ✅ Error handled by axios interceptor
        }
      },
    }),

    // 🔹 SWITCH ROLE (with optimistic update)
    switchRole: builder.mutation({
      query: (payload) => ({
        url: "roles/verifyrole",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ['ActiveRole'],
      async onQueryStarted(payload, { dispatch, queryFulfilled, getState }) {
        const {data} = await queryFulfilled
        console.log(data)
        const previousRole = getState().roles?.activeRole;
        
        // Optimistically update UI
        dispatch(setActiveRole( data.activeRole));

        try {
          await queryFulfilled;
        } catch {
          // Rollback on failure
          if (previousRole) {
            dispatch(setActiveRole(previousRole));
          }
          // ✅ Error handled by axios interceptor
        }
      },
    }),

    // 🔹 GET ACTIVE ROLE


  }),
});

export const {
  useGetRolesQuery,
  useCreateRolesMutation,
  useDeleteRoleMutation,
  useSwitchRoleMutation,
} = rolesApi;