import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface page {
  pageEnd: number | null;
  balanceType: "usd" | "locked";
  globalLoading: boolean;
  theme: "white" | "dark";
  alphPrice: number | null;
  API_STATS: string;
}

const initialState: page = {
  pageEnd: null,
  balanceType: "usd",
  globalLoading: false,
  theme: "white",
  alphPrice: null,
  API_STATS: "",
};

export const pagesSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    setPageEnd: (state, action: PayloadAction<number>) => {
      state.pageEnd = action.payload;
    },
    setBalanceType: (state, action: PayloadAction<"usd" | "locked">) => {
      state.balanceType = action.payload;
    },
    resetBalanceType: (state) => {
      state.balanceType = "usd";
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    setTheme: (state, action: PayloadAction<"white" | "dark">) => {
      state.theme = action.payload;
    },
    setAlphPrice: (state, action: PayloadAction<number | null>) => {
      state.alphPrice = action.payload;
    },
    setApi: (state, action: PayloadAction<string>) => {
      state.API_STATS = action.payload;
    },
  },
});

export const {
  setPageEnd,
  setBalanceType,
  resetBalanceType,
  setGlobalLoading,
  setTheme,
  setAlphPrice,
  setApi,
} = pagesSlice.actions;

export default pagesSlice.reducer;
