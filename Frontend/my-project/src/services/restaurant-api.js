import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axios-base-query.js";
import {
  setActiveRestaurant,
  setRestaurants,
} from "../redux/slice/restaurant-slice.js";

export const restaurantsApi = createApi({
  reducerPath: "restaurantsApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Restaurant"],
  endpoints: (builder) => ({
    /* ---------- Create Restaurant ---------- */
    createRestaurant: builder.mutation({
      query: (data) => ({
        url: "/restaurants",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Restaurant"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setActiveRestaurant(data));
      },
    }),

    /* ---------- Get My Restaurant ---------- */
    getMyRestaurant: builder.query({
      query: () => ({
        url: "/restaurants/my",
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
        url: `/restaurants/${city}`,
        method: "GET",
      }),
      providesTags: ["Restaurant"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setRestaurants(data));
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
