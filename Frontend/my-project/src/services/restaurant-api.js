import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axios-base-query.js";
import {
  resetRestaurants,
  setActiveRestaurant,
  setRestaurants,
} from "../redux/slice/restaurant-slice.js";

export const restaurantsApi = createApi({
  reducerPath: "restaurantsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Restaurant"],
  endpoints: (builder) => ({
    /* ---------- Create Restaurant ---------- */
    createRestaurant: builder.mutation({
      query: (data) => ({
        url: "restaurants/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Restaurant"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setActiveRestaurant(data.data));
      },
    }),

    /* ---------- Get My Restaurant ---------- */
    getMyRestaurant: builder.query({
      query: () => ({
        url: "/restaurants/getmyrestaurant",
        method: "GET",
      }),
      providesTags: ["Restaurant"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setActiveRestaurant(data));
      },
    }),

    /* ---------- Get All Restaurants ---------- */
    getRestaurants: builder.query({
      query: () => ({
        url: "/restaurants",
        method: "GET",
      }),
      providesTags: ["Restaurant"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setRestaurants(data));
      },
    }),

    /* ---------- Get Restaurants By City ---------- */
    getRestaurantsByCity: builder.query({
  query: (city) => ({
    url: `restaurants/getrestaurantsbycity/${city}`,
    method: "GET",
  }),
  providesTags: ["Restaurant"],
  async onQueryStarted(_, { dispatch, queryFulfilled }) {
    try {
      const { data } = await queryFulfilled;

      // ✅ adjust this based on your backend response shape
      dispatch(setRestaurants(data.restaurants));
    } catch (error) {
      dispatch(resetRestaurants());

      console.error("Get restaurants by city failed:", error);
    }
  },
}),

  }),
});

export const {
  useCreateRestaurantMutation,
  useGetMyRestaurantQuery,
  useGetRestaurantsQuery,
  useGetRestaurantsByCityQuery,
  useUpdateRestaurantMutation,
} = restaurantsApi;
