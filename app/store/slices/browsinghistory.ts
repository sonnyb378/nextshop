import { bindActionCreators, createSlice, isPlainObject, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "..";

import { IProduct } from "../../../ts/product";

// export interface ImageData {
//   id: string | null;
//   url: string | null;
//   width: number;
//   height: number;
// }

// export interface PriceRange {
//   minVariantPrice: {
//     amount: string;
//     currencyCode: string | null;
//   };
//   maxVariantPrice: {
//     amount: string;
//     currencyCode: string | null;
//   };
// }

// export interface Product {
//   id: string | null;
//   title: string | null;
//   description: string | null;
//   priceRange: IPriceRange;
//   image: IImageStruct | null;
// }

// export interface BrowsingHistoryState {
//   products: [Product];
// }

const BrowsingHistorySlice = createSlice({
  name: "browsinghistory",
  initialState: [] as IProduct[],
  reducers: {
    setBrowsingHistoryData: (state: IProduct[], action: PayloadAction<IProduct>) => {
      state.unshift(action.payload);
    },
    removeProductInBrowsingHistory: (state: IProduct[], action: PayloadAction<string>) => {
      return state.filter((obj) => obj.id !== action.payload);
    },
  },
});

export const selectBrowsingHistory = (state: AppState) => state.browsinghistory;
export const { setBrowsingHistoryData, removeProductInBrowsingHistory } =
  BrowsingHistorySlice.actions;
export default BrowsingHistorySlice.reducer;
