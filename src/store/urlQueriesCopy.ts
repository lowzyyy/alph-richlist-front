import { Middleware, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { initialState, urlQueriesState } from "./urlQueriesSlice";
import { RootState } from "./store";
import { url } from "inspector";
import { validateSortOrder } from "../components/Wallets/validation";

const iState: urlQueriesState = initialState;
export const urlQueriesCopySlice = createSlice({
  name: "urlQueriesCopy",
  initialState: iState,
  reducers: {
    copyState: (state) => {
      state = { ...state };
    },
    tmpCpy: (state, action: PayloadAction<urlQueriesState>) => {
      return action.payload;
    },
    setSortOrderCopy: (state, action: PayloadAction<{ sort: string; order: string }>) => {
      state.sortOrder = validateSortOrder(action.payload.sort, action.payload.order);
    },
  },
});

export const getCopyQuery = (state: RootState) => {
  const urlQ = state.urlQueriesCopy;
  return (
    urlQ.sortOrder.query +
    (urlQ.filter.checked ? urlQ.filter.query : "") +
    (urlQ.age.checked ? urlQ.age.query : "") +
    (urlQ.balance.checked ? urlQ.balance.query : "") +
    (urlQ.zeroOuts.checked ? urlQ.zeroOuts.query : "") +
    (urlQ.dormant.checked ? urlQ.dormant.query : "")
  );
};
export const getCopyQuerySplitSort = (state: RootState) => {
  const urlQ = state.urlQueriesCopy;
  return {
    sortOrder: urlQ.sortOrder,
    queriesWithoutSort:
      (urlQ.filter.checked ? urlQ.filter.query : "") +
      (urlQ.age.checked ? urlQ.age.query : "") +
      (urlQ.balance.checked ? urlQ.balance.query : "") +
      (urlQ.zeroOuts.checked ? urlQ.zeroOuts.query : "") +
      (urlQ.dormant.checked ? urlQ.dormant.query : ""),
  };
};

export const { copyState, tmpCpy, setSortOrderCopy } = urlQueriesCopySlice.actions;
export default urlQueriesCopySlice.reducer;

// middleware to copy existing state
export const copyStateMiddle: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    if (action.type === "urlQueriesCopy/copyState") {
      store.dispatch(tmpCpy(store.getState().urlQueries));
    } else next(action);
  };
