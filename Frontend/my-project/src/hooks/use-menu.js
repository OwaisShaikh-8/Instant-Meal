import { useEffect } from "react";
import { useSelector } from "react-redux";
import useRestaurant from "./use-restaurant";
import {
  useGetMenuByRestaurantQuery,
  useAddMenuItemMutation,
  useDeleteMenuItemMutation,
} from "../services/menu-api";




const useMenu = () => {
  // 📦 restaurant state
  
  const {activeRestaurant} = useRestaurant({});

  // 📦 menu state
  const menuItems = useSelector((state) => state?.menu?.menuItems);

  // 🚀 fetch menu (only when restaurant exists)
  const {
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetMenuByRestaurantQuery(undefined, {
    skip: !activeRestaurant,
  });

  // mutations
  const [addMenuItem, addStatus] = useAddMenuItemMutation();
  const [deleteMenuItem, deleteStatus] = useDeleteMenuItemMutation();

  return {
    // data
    menuItems,
    activeRestaurant,

    // status
    isLoading,
    isFetching,
    error,

    // actions
    addMenuItem,
    deleteMenuItem,
    refetchMenu:refetch,

    // mutation states (useful for UI)
    addStatus,
    deleteStatus,
  };
};

export default useMenu;
