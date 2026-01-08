import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/auth-slice.js';
import { authApi } from '../services/auth-api.js';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]:authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware)
});