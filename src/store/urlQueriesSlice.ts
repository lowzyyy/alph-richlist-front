import { createSlice, Middleware, PayloadAction } from "@reduxjs/toolkit";
import {
  validateAge,
  validateBalanceClient,
  validateBalanceURL,
  validateDormant,
  validateFilter,
  validateSortOrder,
  validateZeroOuts,
} from "../components/Wallets/validation";
import { queryParam } from "../components/Wallets/WalletTypes";
import { RootState } from "./store";
import { url } from "inspector";

export interface urlQueriesState {
  sortOrder: { query: string; sortVal: string; orderVal: string };
  filter: { query: string; filterVal: string; checked: boolean };
  age: { query: string; ageVal: string; checked: boolean };
  balance: {
    query: string;
    balanceLeftVal: string;
    balanceRightVal: string;
    checked: boolean;
  };
  zeroOuts: { query: string; checked: boolean };
  dormant: { query: string; dorVal: string; checked: boolean };
}
export const initialState: urlQueriesState = {
  sortOrder: { query: "", sortVal: "", orderVal: "" },
  filter: { query: "", filterVal: "", checked: false },
  age: { query: "", ageVal: "", checked: false },
  balance: { query: "", balanceLeftVal: "", balanceRightVal: "", checked: false },
  zeroOuts: { query: "", checked: false },
  dormant: { query: "", dorVal: "", checked: false },
};

type urlQueriesArgs = {
  sortOrder: {
    sort: queryParam;
    order: queryParam;
  };
  filter: queryParam;
  age: queryParam;
  balance: queryParam;
  zeroOuts: queryParam;
  dormant: queryParam;
};

type balanceClient = Omit<urlQueriesState["balance"], "query">;
export const urlQueriesSlice = createSlice({
  name: "urlQueries",
  initialState,
  reducers: {
    setSortOrder: (state, action: PayloadAction<{ sort: string; order: string }>) => {
      state.sortOrder = {
        query: validateSortOrder(action.payload.sort, action.payload.order).query,
        sortVal: action.payload.sort,
        orderVal: action.payload.order,
      };
    },
    setFilter: (state, action: PayloadAction<{ filter: string; checked: boolean }>) => {
      state.filter = {
        query: validateFilter(action.payload.filter).query,
        filterVal: action.payload.filter,
        checked: action.payload.checked,
      };
    },

    setAge: (state, action: PayloadAction<{ age: string; checked: boolean }>) => {
      state.age = {
        query: validateAge(action.payload.age).query,
        ageVal: action.payload.age,
        checked: action.payload.checked,
      };
    },
    setBalance: (state, action: PayloadAction<balanceClient>) => {
      state.balance = {
        query: validateBalanceClient(
          action.payload.balanceLeftVal,
          action.payload.balanceRightVal
        ).query,
        balanceLeftVal: action.payload.balanceLeftVal,
        balanceRightVal: action.payload.balanceRightVal,
        checked: action.payload.checked,
      };
    },
    setZeroOuts: (state, action: PayloadAction<{ checked: boolean }>) => {
      state.zeroOuts = {
        query: validateZeroOuts(action.payload.checked.toString()).query,
        checked: action.payload.checked,
      };
    },
    setDormant: (state, action: PayloadAction<{ dormant: string; checked: boolean }>) => {
      state.dormant = {
        query: validateDormant(action.payload.dormant).query,
        dorVal: action.payload.dormant,
        checked: action.payload.checked,
      };
    },
    loadSavedQueries: (state) => {
      state = state;
    },
    loadTmp: (state, action: PayloadAction<urlQueriesState>) => {
      return action.payload;
    },
    setAllQueriesURL: (state, action: PayloadAction<urlQueriesArgs>): urlQueriesState => {
      const sortOrder = validateSortOrder(
        action.payload.sortOrder.sort,
        action.payload.sortOrder.order
      );
      const filter = validateFilter(action.payload.filter);
      const age = validateAge(action.payload.age);
      const balance = {
        ...validateBalanceURL(action.payload.balance),
        checked: state.balance.checked,
      };
      const zeroOuts = validateZeroOuts(action.payload.zeroOuts);
      const dormant = validateDormant(action.payload.dormant);
      return {
        sortOrder,
        filter: { ...filter, checked: !!filter.query.length },
        age: { ...age, checked: !!age.query.length },
        balance: { ...balance, checked: !!balance.query.length },
        zeroOuts: { ...zeroOuts, checked: !!zeroOuts.query.length },
        dormant: { ...dormant, checked: !!dormant.query.length },
      };
    },
    resetAllQueries: () => {
      return initialState;
    },
  },
});

export const getQuery = (state: RootState) => {
  const urlQ = state.urlQueries;
  return (
    urlQ.sortOrder.query +
    (urlQ.filter.checked ? urlQ.filter.query : "") +
    (urlQ.age.checked ? urlQ.age.query : "") +
    (urlQ.balance.checked ? urlQ.balance.query : "") +
    (urlQ.zeroOuts.checked ? urlQ.zeroOuts.query : "") +
    (urlQ.dormant.checked ? urlQ.dormant.query : "")
  );
};

export const {
  setSortOrder,
  setFilter,
  setAge,
  setBalance,
  setAllQueriesURL,
  setZeroOuts,
  setDormant,
  resetAllQueries,
  loadSavedQueries,
  loadTmp,
} = urlQueriesSlice.actions;
export default urlQueriesSlice.reducer;

// middleware to load copy of already saved states
export const loadStateMiddle: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    if (action.type === "urlQueries/loadSavedQueries") {
      store.dispatch(loadTmp(store.getState().urlQueriesCopy));
    } else next(action);
  };
