import { useEffect } from "react";
import { useSelector } from "react-redux";
import useRestaurant from "./use-restaurant";
import {
  useGetMenuByRestaurantQuery,
  useAddMenuItemMutation,
  useDeleteMenuItemMutation,
} from "../services/menu-api";


const useMenu = (id) => {
  const menuItems = useSelector((state) => state?.menu?.menuItems);

  const { isLoading, isFetching, error, refetch } = useGetMenuByRestaurantQuery(
    id,
    {
      skip: !id,
      refetchOnMountOrArgChange: true,
    },
  );

  // mutations
  const [addMenuItem, addStatus] = useAddMenuItemMutation();
  const [deleteMenuItem, deleteStatus] = useDeleteMenuItemMutation();

  return {
    // data
    menuItems,

    // status
    isLoading,
    isFetching,
    error,

    // actions
    addMenuItem,
    deleteMenuItem,
    refetchMenu: refetch,

    addStatus,
    deleteStatus,
  };
};

export default useMenu;
