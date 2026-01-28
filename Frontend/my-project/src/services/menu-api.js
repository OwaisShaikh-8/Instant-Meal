import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axios-base-query";
import { setMenuItems } from "../redux/slice/menu-slice";



export const menuApi = createApi({
  reducerPath: "menuApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Menu"],
  endpoints: (builder) => ({



    addMenuItem: builder.mutation({
      async queryFn(data, api, _extra, baseQuery) {
        const state = api.getState();
        const restaurantId = state.restaurants?.activeRestaurant?.data?._id;


        if (!restaurantId) {
          return {
            error: {
              status: 400,
              data: "Restaurant not selected",
            },
          };
        }

        return baseQuery({
          url: `menu/createmenuitem/${restaurantId}`,
          method: "POST",
          data,
        });
      },
      invalidatesTags: ["Menu"],
    }),

    /* =====================
       📥 Fetch Menu
    ===================== */
    getMenuByRestaurant: builder.query({
      async queryFn(_, api, _extra, baseQuery) {
        const state = api.getState();
        const restaurantId =
          state.restaurants?.activeRestaurant?.data?._id;

        if (!restaurantId) {
          return {
            error: {
              status: 400,
              data: "Restaurant not selected",
            },
          };
        }

        const result = await baseQuery({
          url: `menu/getmenuitems/${restaurantId}`,
          method: "GET",
        });

        if (result?.data) {
          api.dispatch(setMenuItems(result?.data?.data));
        }

        return result;
      },
      providesTags: ["Menu"],
    }),

    /* =====================
       ❌ Delete Menu
    ===================== */
    deleteMenuItem: builder.mutation({
      async queryFn(menuId, api, _extra, baseQuery) {
        const state = api.getState();
        const restaurantId =
          state.restaurants?.activeRestaurant?.data?._id;

        if (!restaurantId) {
          return {
            error: {
              status: 400,
              data: "Restaurant not selected",
            },
          };
        }

        return baseQuery({
          url: `/menu/${restaurantId}/${menuId}`,
          method: "DELETE",
        });
      },
      invalidatesTags: ["Menu"],
    }),
  }),
});

export const {
  useAddMenuItemMutation,
  useGetMenuByRestaurantQuery,
  useDeleteMenuItemMutation,
} = menuApi;
