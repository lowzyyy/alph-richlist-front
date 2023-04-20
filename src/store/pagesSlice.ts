import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface page {
  pageEnd: number | null;
  balanceType: "usd" | "locked";
  globalLoading: boolean;
}

const initialState: page = {
  pageEnd: null,
  balanceType: "usd",
  globalLoading: false,
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
  },
});

export const { setPageEnd, setBalanceType, resetBalanceType, setGlobalLoading } =
  pagesSlice.actions;

export default pagesSlice.reducer;
