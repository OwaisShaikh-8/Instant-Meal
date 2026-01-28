import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/auth-slice.js';
import rolesReducer from './slice/roles-slice.js'
import restaurantsReducer from './slice/restaurant-slice.js'
import menuReducer from './slice/menu-slice.js'
import { authApi } from '../services/auth-api.js';
import { rolesApi } from '../services/roles-api.js';
import { restaurantsApi } from '../services/restaurant-api.js';
import { menuApi } from '../services/menu-api.js';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    roles: rolesReducer,
    restaurants: restaurantsReducer,
    menu:menuReducer,
    [authApi.reducerPath] : authApi.reducer,
    [rolesApi.reducerPath]:rolesApi.reducer,
    [restaurantsApi.reducerPath]:restaurantsApi.reducer,
    [menuApi.reducerPath]:menuApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,rolesApi.middleware, restaurantsApi.middleware, menuApi.middleware),
  
});