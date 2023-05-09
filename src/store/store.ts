import { combineReducers, configureStore } from "@reduxjs/toolkit";
import urlQueriesReducer, { loadStateMiddle } from "./urlQueriesSlice";
import filterModalReducer from "./filterModalSlice";
import urlQueriesCopyReducer, { copyStateMiddle } from "./urlQueriesCopySlice";
import pagesReducer from "./pagesSlice";
import searchModalReducer from "./searchModalSlice";

const rootReducer = combineReducers({
  urlQueries: urlQueriesReducer,
  filterModal: filterModalReducer,
  urlQueriesCopy: urlQueriesCopyReducer,
  pages: pagesReducer,
  searchModal: searchModalReducer,
});
export const store = configureStore({
  reducer: rootReducer,
  middleware: [copyStateMiddle, loadStateMiddle],
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
