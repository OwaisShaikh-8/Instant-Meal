// redux/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  carts: {}, // { restaurantId: { itemId: quantity } }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { restaurantId, itemId } = action.payload;
      if (!state.carts[restaurantId]) state.carts[restaurantId] = {};
      if (!state.carts[restaurantId][itemId]) {
        state.carts[restaurantId][itemId] = 1;
      } else {
        state.carts[restaurantId][itemId] += 1;
      }
    },
    removeFromCart: (state, action) => {
      const { restaurantId, itemId } = action.payload;
      if (state.carts[restaurantId]?.[itemId]) {
        state.carts[restaurantId][itemId] -= 1;
        if (state.carts[restaurantId][itemId] <= 0) {
          delete state.carts[restaurantId][itemId];
        }
      }
    },
    deleteFromCart: (state, action) => {
      const { restaurantId, itemId } = action.payload;
      if (state.carts[restaurantId]?.[itemId]) {
        delete state.carts[restaurantId][itemId];
      }
    },
    clearCart: (state, action) => {
      const { restaurantId } = action.payload;
      if (state.carts[restaurantId]) {
        state.carts[restaurantId] = {};
      }
    },
  },
});

export const { addToCart, removeFromCart, deleteFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
