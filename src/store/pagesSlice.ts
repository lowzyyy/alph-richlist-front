import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface page {
  pageEnd: number | null;
  balanceType: "usd" | "locked";
}

const initialState: page = {
  pageEnd: null,
  balanceType: "usd",
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
  },
});

export const { setPageEnd, setBalanceType, resetBalanceType } = pagesSlice.actions;

export default pagesSlice.reducer;
