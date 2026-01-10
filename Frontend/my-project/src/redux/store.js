import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/auth-slice.js';
import rolesReducer from './slice/roles-slice.js'
import { authApi } from '../services/auth-api.js';
import { rolesApi } from '../services/roles-api.js';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    roles: rolesReducer,
    [authApi.reducerPath]:authApi.reducer,
    [rolesApi.reducerPath]:rolesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,rolesApi.middleware),
  
});