import { createSlice } from "@reduxjs/toolkit";

interface searchModalState {
  showSearch: boolean;
}

const initialState: searchModalState = {
  showSearch: false,
};

export const searchModalSlice = createSlice({
  name: "searchModal",
  initialState,
  reducers: {
    setShowSearch: (state) => {
      state.showSearch = !state.showSearch;
    },
  },
});

export const { setShowSearch } = searchModalSlice.actions;

export default searchModalSlice.reducer;
