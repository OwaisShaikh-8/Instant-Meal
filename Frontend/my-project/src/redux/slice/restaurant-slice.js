import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeRestaurant: null,
  restaurants: [],
};

const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    setActiveRestaurant: (state, action) => {
      state.activeRestaurant = action.payload;
    },

    setRestaurants: (state, action) => {
      state.restaurants = action.payload;
    },

    resetRestaurants: (state) => {
      state.activeRestaurant = null;
      state.restaurants = [];
    },
  },
});

export const {
  setActiveRestaurant,
  setRestaurants,
  resetRestaurants,
} = restaurantsSlice.actions;

export default restaurantsSlice.reducer;
