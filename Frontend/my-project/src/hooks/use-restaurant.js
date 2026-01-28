import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateRestaurantMutation,
  useGetMyRestaurantQuery,
  useGetRestaurantsQuery,
  useGetRestaurantsByCityQuery,
} from "../services/restaurant-api.js";
import { useNavigate } from "react-router-dom";
import { resetRestaurants } from "../redux/slice/restaurant-slice.js";

const useRestaurant = ({
  city = null,
  shouldFetchMyRestaurant = false,
  shouldFetchAllRestaurants = false,
  shouldFetchByCity = false,
} = {}) => {
  const navigate = useNavigate();

  // 📦 Redux state
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
        console.log(restaurantData)
      try {
        
        const response = await createRestaurant(restaurantData).unwrap();

        
        return response;
      } catch (error) {
        console.error("Create restaurant failed:", error);
        throw error;
      }
    },
    [createRestaurant, navigate]
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

  // =====================
  // 📤 Return API
  // =====================

  return {
    // State
    activeRestaurant,
    restaurants,

    // Actions
    createNewRestaurant,
    fetchMyRestaurant,
    fetchAllRestaurants,
    fetchRestaurantsByCity,

    // Loading states
    isMyRestaurantLoading,
    isRestaurantsLoading,
    isCityRestaurantsLoading,
    isCreateRestaurantLoading,

    // Error flags
    isMyRestaurantError,
    isRestaurantsError,
    isCityRestaurantsError,
    isCreateRestaurantError,

    // Error objects
    myRestaurantError,
    restaurantsError,
    cityRestaurantsError,
    createRestaurantError,
  };
};

export default useRestaurant;
