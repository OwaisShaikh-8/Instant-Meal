import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuItems: [],     // all menu items
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    // Set all menu items
    setMenuItems: (state, action) => {
      state.menuItems = action.payload;
    },

    // Reset menu state
    resetMenu: () => initialState,
  },
});

export const {
  setMenuItems,
  resetMenu,
} = menuSlice.actions;

export default menuSlice.reducer;
