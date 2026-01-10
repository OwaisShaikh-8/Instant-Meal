import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeRole: null,
  allRoles: null,
};

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setActiveRole: (state, action) => {
      state.activeRole = action.payload;
    },
    setAllRoles: (state, action) => {
      state.allRoles = action.payload;
    },
    resetRoles: (state) => {
      state.activeRole = null;
      state.allRoles = null;
    }
  },
});

export const { setActiveRole, setAllRoles, resetRoles } = rolesSlice.actions;
export default rolesSlice.reducer;
