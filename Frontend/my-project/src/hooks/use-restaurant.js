import { useCallback } from "react";
import { useSelector } from "react-redux";
import {
  useCreateRestaurantMutation,
  useGetMyRestaurantQuery,
  useGetRestaurantsQuery,
  useGetRestaurantsByCityQuery,
  useGetRestaurantByIdQuery, // 👈 NEW
} from "../services/restaurant-api.js";

const useRestaurant = ({
  id = null, // 👈 NEW
  city = null,
  shouldFetchMyRestaurant = false,
  shouldFetchAllRestaurants = false,
  shouldFetchByCity = false,
  shouldFetchById = false, // 👈 NEW
} = {}) => {

  // =====================
  // 📦 Redux State
  // =====================

  const activeRestaurant = useSelector(
    (state) => state.restaurants.activeRestaurant
  );

  const restaurants = useSelector(
    (state) => state.restaurants.restaurants
  );

  // =====================
  // 🔹 Queries
  // =====================

  const {
    isLoading: isMyRestaurantLoading,
    isError: isMyRestaurantError,
    error: myRestaurantError,
    refetch: refetchMyRestaurant,
  } = useGetMyRestaurantQuery(undefined, {
    skip: !shouldFetchMyRestaurant,
  });

  const {
    isLoading: isRestaurantsLoading,
    isError: isRestaurantsError,
    error: restaurantsError,
    refetch: refetchRestaurants,
  } = useGetRestaurantsQuery(undefined, {
    skip: !shouldFetchAllRestaurants,
  });

  const {
    isLoading: isCityRestaurantsLoading,
    isError: isCityRestaurantsError,
    error: cityRestaurantsError,
    refetch: refetchCityRestaurants,
  } = useGetRestaurantsByCityQuery(city, {
    skip: !shouldFetchByCity || !city,
  });

  // ✅ NEW: Get Restaurant By ID
  const {
    isLoading: isRestaurantByIdLoading,
    isError: isRestaurantByIdError,
    error: restaurantByIdError,
    refetch: refetchRestaurantById,
  } = useGetRestaurantByIdQuery(id, {
    skip: !shouldFetchById || !id,
  });

  // =====================
  // 🔹 Mutations
  // =====================

  const [
    createRestaurant,
    {
      isLoading: isCreateRestaurantLoading,
      isError: isCreateRestaurantError,
      error: createRestaurantError,
    },
  ] = useCreateRestaurantMutation();

  // =====================
  // 🚀 Actions
  // =====================

  const createNewRestaurant = useCallback(
    async (restaurantData) => {
      try {
        const response = await createRestaurant(restaurantData).unwrap();
        return response;
      } catch (error) {
        console.error("Create restaurant failed:", error);
        throw error;
      }
    },
    [createRestaurant]
  );

  const fetchMyRestaurant = useCallback(async () => {
    try {
      const response = await refetchMyRestaurant();
      return response.data;
    } catch (error) {
      console.error("Fetch my restaurant failed:", error);
      throw error;
    }
  }, [refetchMyRestaurant]);

  const fetchAllRestaurants = useCallback(async () => {
    try {
      const response = await refetchRestaurants();
      return response.data;
    } catch (error) {
      console.error("Fetch restaurants failed:", error);
      throw error;
    }
  }, [refetchRestaurants]);

  const fetchRestaurantsByCity = useCallback(async () => {
    try {
      const response = await refetchCityRestaurants();
      return response.data;
    } catch (error) {
      console.error("Fetch city restaurants failed:", error);
      throw error;
    }
  }, [refetchCityRestaurants]);

  // ✅ NEW: Fetch Restaurant By ID manually
  const fetchRestaurantById = useCallback(async () => {
    try {
      const response = await refetchRestaurantById();
      return response.data;
    } catch (error) {
      console.error("Fetch restaurant by ID failed:", error);
      throw error;
    }
  }, [refetchRestaurantById]);

  // =====================
  // 📤 Return API
  // =====================

  return {
    // Redux State
    activeRestaurant,
    restaurants,

    // Single Restaurant

    // Actions
    createNewRestaurant,
    fetchMyRestaurant,
    fetchAllRestaurants,
    fetchRestaurantsByCity,
    fetchRestaurantById,

    // Loading states
    isMyRestaurantLoading,
    isRestaurantsLoading,
    isCityRestaurantsLoading,
    isRestaurantByIdLoading,
    isCreateRestaurantLoading,

    // Error flags
    isMyRestaurantError,
    isRestaurantsError,
    isCityRestaurantsError,
    isRestaurantByIdError,
    isCreateRestaurantError,

    // Error objects
    myRestaurantError,
    restaurantsError,
    cityRestaurantsError,
    restaurantByIdError,
    createRestaurantError,
  };
};

export default useRestaurant;
