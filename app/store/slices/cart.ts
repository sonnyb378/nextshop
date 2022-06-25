import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "..";

import { ICartState } from "../../../ts/cart/interfaces/cart";
// export interface CartState {
//   cartId: string | null;
//   itemsCount: number;
// }
const initialState = {
  cartId: null,
} as ICartState;

export const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartData: (state: ICartState, action: PayloadAction<ICartState>) => {
      state.cartId = action.payload.cartId;
      state.itemsCount = action.payload.itemsCount;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      if (!action.payload.cart.cartId) {
        return state;
      }
      state.cartId = action.payload.cart.cartId;
      state.itemsCount = action.payload.cart.itemsCount;
    },
  },
});

export const selectCart = (state: AppState) => state.cart;
export const { setCartData } = CartSlice.actions;
export default CartSlice.reducer;
