// hooks/useCart.js
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
  deleteFromCart,
  clearCart,
} from "../redux/slice/cart-slice";
import {
  selectCartByRestaurant,
  selectTotalItems,
  selectCartItemsWithIds,
} from "../redux/selectors/cartSelectors";

const useCart = (restaurantId) => {
  const dispatch = useDispatch();

  // Get cart data from Redux
  const cart = useSelector(selectCartByRestaurant(restaurantId));
  const totalItems = useSelector(selectTotalItems(restaurantId));
  const items = useSelector(selectCartItemsWithIds(restaurantId));

  // Action functions
  const addItem = (itemId) => {
    dispatch(addToCart({ restaurantId, itemId }));
  };

  const removeItem = (itemId) => {
    dispatch(removeFromCart({ restaurantId, itemId }));
  };

  const deleteItem = (itemId) => {
    dispatch(deleteFromCart({ restaurantId, itemId }));
  };

  const clearRestaurantCart = () => {
    dispatch(clearCart({ restaurantId }));
  };

  return {
    cart,              // { itemId: quantity }
    items,             // [{ itemId, quantity }]
    totalItems,        // total quantity
    addItem,
    removeItem,
    deleteItem,
    clearRestaurantCart,
  };
};

export default useCart;
