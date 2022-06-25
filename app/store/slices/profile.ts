import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "..";
import { IProfileState } from "../../../ts/profile/profile_state";

const initialState = {
  id: null,
  email: null,
  firstName: null,
  lastName: null,
  countryCode: null,
} as IProfileState;

export const ProfileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    setProfileData: (state: IProfileState, action: PayloadAction<IProfileState>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.countryCode = action.payload.countryCode;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      if (!action.payload.profile.email) {
        return state;
      }
      state.id = action.payload.profile.id;
      state.email = action.payload.profile.email;
      state.firstName = action.payload.profile.firstName;
      state.lastName = action.payload.profile.lastName;
      state.countryCode = action.payload.profile.countryCode;
    },
  },
});

export const selectProfile = (state: AppState) => state.profile;

export const { setProfileData } = ProfileSlice.actions;

export default ProfileSlice.reducer;
