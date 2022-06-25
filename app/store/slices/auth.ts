import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "..";

import { IAuthState } from "../../../ts/states/auth_state";

const initialState = {
  id: null,
  accessToken: null,
  expiresAt: null,
} as IAuthState;

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state: IAuthState, action: PayloadAction<IAuthState>) => {
      state.id = action.payload.id;
      state.accessToken = action.payload.accessToken;
      state.expiresAt = action.payload.expiresAt;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      if (!action.payload.auth.accessToken) {
        return state;
      }
      state.id = action.payload.auth.id;
      state.accessToken = action.payload.auth.accessToken;
      state.expiresAt = action.payload.auth.expiresAt;
    },
  },
});

export const selectAuth = (state: AppState) => state.auth;
export const { setAuthData } = AuthSlice.actions;
export default AuthSlice.reducer;
