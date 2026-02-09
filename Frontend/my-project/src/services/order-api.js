import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axios-base-query";
 
import { setOrders,setActiveOrder } from "../redux/slice/order-slice";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Order"],
  endpoints: (builder) => ({

    // 🔹 Get customer orders
    getCustomerOrders: builder.query({
      query: (customerId) => ({
        url:`orders/customer/${customerId}`,
        method:'GET'
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setOrders(data.orders));
        } catch (error) {
          console.error("Customer orders error", error);
        }
      },
      providesTags: ["Order"],
    }),

    // 🔹 Get restaurant orders
    getRestaurantOrders: builder.query({
      query: (restaurantId) => ({
        url: `orders/restaurant/${restaurantId}`,
        method: "GET"
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setOrders(data.orders));
        } catch (error) {
          console.error("Restaurant orders error", error);
        }
      },
      providesTags: ["Order"],
    }),

    // 🔹 Get order by ID
    getOrderById: builder.query({
      query: (orderId) => ({
        url:`orders/${orderId}`,
        method:'GET'
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setActiveOrder(data.order));
        } catch (error) {
          console.error("Get order by id error", error);
        }
      },
      providesTags: ["Order"],
    }),

    // 🔹 Create order
    createOrder: builder.mutation({
      query: (data) => ({
        url: "orders/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Order"],
    }),

    // 🔹 Update order status
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `orders/${orderId}/status`,
        method: "PATCH",
        data: { status },
      }),
      async onQueryStarted({ orderId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setActiveOrder(data.order));
        } catch (error) {
          console.error("Update order status error", error);
        }
      },
      invalidatesTags: ["Order"],
    }),

    // 🔹 Delete order
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `orders/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetCustomerOrdersQuery,
  useGetRestaurantOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApi;