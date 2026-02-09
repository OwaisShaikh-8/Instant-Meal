import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

import authReducer from "./slice/auth-slice.js";
import rolesReducer from "./slice/roles-slice.js";
import restaurantsReducer from "./slice/restaurant-slice.js";
import menuReducer from "./slice/menu-slice.js";
import cartReducer from "./slice/cart-slice.js";
import orderReducer from "./slice/order-slice.js";
import cityReducer from "./slice/extra-slice.js";

import { authApi } from "../services/auth-api.js";
import { rolesApi } from "../services/roles-api.js";
import { restaurantsApi } from "../services/restaurant-api.js";
import { menuApi } from "../services/menu-api.js";
import { orderApi } from "../services/order-api.js";

/* ---------------- root reducer ---------------- */
const rootReducer = combineReducers({
  city: cityReducer,
  auth: authReducer,
  roles: rolesReducer,
  restaurants: restaurantsReducer,
  menu: menuReducer,
  cart: cartReducer,
  order: orderReducer,

  [authApi.reducerPath]: authApi.reducer,
  [rolesApi.reducerPath]: rolesApi.reducer,
  [restaurantsApi.reducerPath]: restaurantsApi.reducer,
  [menuApi.reducerPath]: menuApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
});

/* ---------------- persist config ---------------- */
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart", "city","roles"], 
  // ⬆️ persist only what you need
  // NEVER persist RTK Query APIs
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

/* ---------------- store ---------------- */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      rolesApi.middleware,
      restaurantsApi.middleware,
      menuApi.middleware,
      orderApi.middleware
    ),
});

export const persistor = persistStore(store);
