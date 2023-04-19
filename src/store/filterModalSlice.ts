import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface filterModalState {
  showFilter: boolean;
}

const initialState: filterModalState = {
  showFilter: false,
};

export const filterModalSlice = createSlice({
  name: "filterModal",
  initialState,
  reducers: {
    setShowModal: (state) => {
      state.showFilter = !state.showFilter;
    },
  },
});

export const { setShowModal } = filterModalSlice.actions;

export default filterModalSlice.reducer;
