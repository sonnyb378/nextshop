import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "..";

interface CheckoutState {
  checkoutId: string | null;
  webUrl: string | null;
}

const initialState = {
  checkoutId: null,
  webUrl: null,
} as CheckoutState;

const CheckoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckoutData: (state: CheckoutState, action: PayloadAction<CheckoutState>) => {
      state.checkoutId = action.payload.checkoutId;
      state.webUrl = action.payload.webUrl;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      if (!action.payload.checkout.id) {
        return state;
      }
      state.checkoutId = action.payload.checkout.checkoutId;
      state.webUrl = action.payload.checkout.webUrl;
    },
  },
});

export const selectCheckout = (state: AppState) => state.checkout;
export const { setCheckoutData } = CheckoutSlice.actions;
export default CheckoutSlice.reducer;
