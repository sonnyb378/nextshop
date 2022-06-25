import { Action, combineReducers, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

import {
  persistStore,
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import storage from "../../utils/persistStorage";

import profileReducer from "./slices/profile";
import authReducer from "./slices/auth";
import browsinghistoryReducer from "./slices/browsinghistory";
import cartReducer from "./slices/cart";
import checkoutReducer from "./slices/checkout";

const reducers = combineReducers({
  profile: profileReducer,
  auth: authReducer,
  browsinghistory: browsinghistoryReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["", ""],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const makeStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: true,
});

const setUpStore = () => makeStore;

export type AppStore = ReturnType<typeof setUpStore>;

export type AppDispatch = AppStore["dispatch"]; //

export const persistor = persistStore(makeStore);

export type AppState = ReturnType<AppStore["getState"]>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

export const wrapper = createWrapper<AppStore>(setUpStore);
