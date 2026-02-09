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
        const restaurantId = state.restaurants?.activeRestaurant?._id;

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
  query: (restaurantId) => ({
    url: `menu/getmenuitems/${restaurantId}`,
    method: "GET",
  }),
  
  providesTags: (result, error, restaurantId) => [
    { type: "Menu", id: restaurantId }
  ],
  
  keepUnusedDataFor: 0,
  refetchOnMountOrArgChange: true,
  
  async onQueryStarted(_, { dispatch, queryFulfilled }) {
    try {
      const { data } = await queryFulfilled;
      
      // ✅ Update Redux with menu items or empty array
      if (data?.menuItems) {
        dispatch(setMenuItems(data.menuItems));
      } else {
        dispatch(setMenuItems([]));
      }
    } catch (error) {
      console.error("Get menu failed:", error);
      dispatch(setMenuItems([])); // ✅ Clear on error too
    }
  },
}),
    /* =====================
       ❌ Delete Menu
    ===================== */
    deleteMenuItem: builder.mutation({
      async queryFn(menuId, api, _extra, baseQuery) {
        const state = api.getState();
        const restaurantId =
          state.restaurants?.activeRestaurant?._id; // ✅ Fixed path (removed .data)

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