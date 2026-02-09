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
        try {
          const { data } = await queryFulfilled;
          dispatch(setActiveRestaurant(data.data));
        } catch (error) {
          console.error("Create restaurant failed:", error);
        }
      },
    }),

    /* ---------- Get My Restaurant ---------- */
    getMyRestaurant: builder.query({
      query: () => ({
        url: "restaurants/getmyrestaurant",
        method: "GET",
      }),
      providesTags: ["Restaurant"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setActiveRestaurant(data.activeRestaurant));
        } catch (error) {
          console.error("Get my restaurant failed:", error);
        }
      },
    }),

    /* ---------- Get All Restaurants ---------- */
    getRestaurants: builder.query({
      query: () => ({
        url: "restaurants",
        method: "GET",
      }),
      providesTags: ["Restaurant"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setRestaurants(data));
        } catch (error) {
          console.error("Get restaurants failed:", error);
        }
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

          // adjust if backend response shape is different
          dispatch(setRestaurants(data.restaurants));
        } catch (error) {
          dispatch(resetRestaurants());
          console.error("Get restaurants by city failed:", error);
        }
      },
    }),

    /* ---------- Get Restaurant By ID ---------- */
    getRestaurantById: builder.query({
      query: (id) => ({
        url: `restaurants/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Restaurant", id }],

        keepUnusedDataFor: 0, 
        refetchOnMountOrArgChange: true,



      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // ✅ store clicked restaurant as active
          dispatch(setActiveRestaurant(data.restaurant));
        } catch (error) {
          console.error("Get restaurant by ID failed:", error);
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
  useGetRestaurantByIdQuery,
} = restaurantsApi;
