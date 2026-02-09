import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useGetCustomerOrdersQuery,
  useGetRestaurantOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} from "../services/order-api.js";

const useOrders = ({
  customerId = null,
  restaurantId = null,
  orderId = null,
  shouldFetchCustomerOrders = false,
  shouldFetchRestaurantOrders = false,
  shouldFetchOrderById = false,
} = {}) => {

  // =====================
  // 📦 Redux State
  // =====================

  const activeOrder = useSelector((state) => state.order.activeOrder);
  const orders = useSelector((state) => state.order.allOrders);

  // =====================
  // 🔹 Queries
  // =====================

  const {
    isLoading: isCustomerOrdersLoading,
    isError: isCustomerOrdersError,
    error: customerOrdersError,
    refetch: refetchCustomerOrders,
  } = useGetCustomerOrdersQuery(customerId, {
    skip: !shouldFetchCustomerOrders || !customerId,
    refetchOnMountOrArgChange: true,
  });

  const {
    isLoading: isRestaurantOrdersLoading,
    isError: isRestaurantOrdersError,
    error: restaurantOrdersError,
    refetch: refetchRestaurantOrders,
  } = useGetRestaurantOrdersQuery(restaurantId, {
    skip: !shouldFetchRestaurantOrders || !restaurantId,
    refetchOnMountOrArgChange: true,
  });

  const {
    isLoading: isOrderByIdLoading,
    isError: isOrderByIdError,
    error: orderByIdError,
    refetch: refetchOrderById,
  } = useGetOrderByIdQuery(orderId, {
    skip: !shouldFetchOrderById || !orderId,
    refetchOnMountOrArgChange: true,
  });

  // =====================
  // 🔹 Mutations
  // =====================

  const [
    createOrder,
    {
      isLoading: isCreateOrderLoading,
      isError: isCreateOrderError,
      error: createOrderError,
    },
  ] = useCreateOrderMutation();

  const [
    updateOrderStatus,
    {
      isLoading: isUpdateOrderStatusLoading,
      isError: isUpdateOrderStatusError,
      error: updateOrderStatusError,
    },
  ] = useUpdateOrderStatusMutation();

  const [
    deleteOrder,
    {
      isLoading: isDeleteOrderLoading,
      isError: isDeleteOrderError,
      error: deleteOrderError,
    },
  ] = useDeleteOrderMutation();

  // =====================
  // 🔄 Auto-refetch on argument changes
  // =====================

//   useEffect(() => {
//     if (customerId && shouldFetchCustomerOrders) {
//       refetchCustomerOrders();
//     }
//   }, [customerId, shouldFetchCustomerOrders, refetchCustomerOrders]);

//   useEffect(() => {
//     if (restaurantId && shouldFetchRestaurantOrders) {
//       refetchRestaurantOrders();
//     }
//   }, [restaurantId, shouldFetchRestaurantOrders, refetchRestaurantOrders]);

//   useEffect(() => {
//     if (orderId && shouldFetchOrderById) {
//       refetchOrderById();
//     }
//   }, [orderId, shouldFetchOrderById, refetchOrderById]);

  // =====================
  // 🚀 Actions
  // =====================

  const createNewOrder = useCallback(
    async (formData) => {
      try {
        const response = await createOrder(formData).unwrap();
        return response;
      } catch (error) {
        console.error("Create order failed:", error);
        throw error;
      }
    },
    [createOrder]
  );

  const updateOrder = useCallback(
    async ({ orderId, status }) => {
      try {
        console.log(status)
        const response = await updateOrderStatus({ orderId, status }).unwrap();
        return response;
      } catch (error) {
        console.error("Update order status failed:", error);
        throw error;
      }
    },
    [updateOrderStatus]
  );

  const removeOrder = useCallback(
    async (orderId) => {
      try {
        const response = await deleteOrder(orderId).unwrap();
        return response;
      } catch (error) {
        console.error("Delete order failed:", error);
        throw error;
      }
    },
    [deleteOrder]
  );

  const fetchCustomerOrders = useCallback(async () => {
    try {
      const response = await refetchCustomerOrders();
      return response.data;
    } catch (error) {
      console.error("Fetch customer orders failed:", error);
      throw error;
    }
  }, [refetchCustomerOrders]);

  const fetchRestaurantOrders = useCallback(async () => {
    try {
      const response = await refetchRestaurantOrders();
      return response.data;
    } catch (error) {
      console.error("Fetch restaurant orders failed:", error);
      throw error;
    }
  }, [refetchRestaurantOrders]);

  const fetchOrderById = useCallback(async () => {
    try {
      const response = await refetchOrderById();
      return response.data;
    } catch (error) {
      console.error("Fetch order by ID failed:", error);
      throw error;
    }
  }, [refetchOrderById]);

  // =====================
  // 📤 Return API
  // =====================

  return {
    // Redux State
    activeOrder,
    orders,

    // Actions
    createNewOrder,
    updateOrder,
    removeOrder,
    fetchCustomerOrders,
    fetchRestaurantOrders,
    fetchOrderById,

    // Loading states
    isCustomerOrdersLoading,
    isRestaurantOrdersLoading,
    isOrderByIdLoading,
    isCreateOrderLoading,
    isUpdateOrderStatusLoading,
    isDeleteOrderLoading,

    // Error flags
    isCustomerOrdersError,
    isRestaurantOrdersError,
    isOrderByIdError,
    isCreateOrderError,
    isUpdateOrderStatusError,
    isDeleteOrderError,

    // Error objects
    customerOrdersError,
    restaurantOrdersError,
    orderByIdError,
    createOrderError,
    updateOrderStatusError,
    deleteOrderError,
  };
};

export default useOrders;