import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allOrders: [],      // all orders
  activeOrder: null,  // currently selected/viewing order
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // Set all orders
    setOrders: (state, action) => {
      state.allOrders = action.payload;
    },

    // Set active order (for viewing details)
    setActiveOrder: (state, action) => {
      state.activeOrder = action.payload;
    },

    // Remove order
    removeOrder: (state, action) => {
      state.allOrders = state.allOrders.filter(
        (order) => order._id !== action.payload
      );

      if (state.activeOrder?._id === action.payload) {
        state.activeOrder = null;
      }
    },

    // Clear active order
    clearActiveOrder: (state) => {
      state.activeOrder = null;
    },

    // Reset order state
    resetOrders: () => initialState,
  },
});

export const {
  setOrders,
  setActiveOrder,
  removeOrder,
  clearActiveOrder,
  resetOrders,
} = orderSlice.actions;

export default orderSlice.reducer;
