import React from "react";
import { useRouter } from "next/router";

// store
import { useAppDispatch, useAppSelector } from "@/src/store/storeHooks";
import { setShowModal } from "@/src/store/filterModalSlice";
import { copyState, getCopyQuery } from "@/src/store/urlQueriesCopySlice";
import { getQuery, loadSavedQueries } from "@/src/store/urlQueriesSlice";
// components
import GenesisFilter from "./GenesisFilter";
import AgeFilter from "./AgeFilter";
import BalanceFilter from "./BalanceFilter";
import ZeroOutsFilter from "./ZeroOutsFilter";
import Dormant from "./Dormant";
import { setGlobalLoading } from "@/src/store/pagesSlice";

const resetBodySettings = (theme: "white" | "dark") => {
  document.body.style.overflowY = "auto";
  document.body.style.backgroundColor =
    theme === "white"
      ? `var(--body-bg-default-white)`
      : `var(--body-bg-default-dark)`;
};

export const filterSliderWidth = "w-28";
function FilterModal() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const combinedQuery = useAppSelector(getQuery);
  const combinedQueryCopy = useAppSelector(getCopyQuery);
  const theme = useAppSelector((state) => state.pages.theme);
  // const allQueries = useAppSelector((state) => state.urlQueries);
  // const copy = useAppSelector((state) => state.urlQueriesCopy);
  // console.log("all: ", allQueries);
  // console.log("copy: ", copy);

  // callbacks
  const onModal = (e: any) => {
    if (e.target === e.currentTarget) {
      resetBodySettings(theme);
      dispatch(setShowModal());
    }
  };
  const onClose = () => {
    dispatch(setShowModal());
    dispatch(loadSavedQueries());
    resetBodySettings(theme);
  };

  const onApply = () => {
    dispatch(setShowModal());
    resetBodySettings(theme);
    if (combinedQuery === combinedQueryCopy) return;
    else {
      dispatch(setGlobalLoading(true));
      router.push(`/pages/1?${combinedQuery}`);
    }
  };
  return (
    <div
      onClick={onModal}
      className="fixed left-0 top-0 z-20 h-full w-full bg-slate-200 bg-opacity-40 backdrop-blur-[2px] dark:bg-gray-900 dark:bg-opacity-60 "
    >
      <div
        className={`mx-auto flex h-[450px]
        w-[95%] animate-slideFromLeft1 flex-col justify-between rounded-md bg-indigo-50 p-3 shadow-[0_0px_20px_8px_rgba(0,0,0,0.75)] 
        dark:border  dark:border-stone-600 dark:bg-stone-900 dark:shadow-neutral-900
          xs:w-[400px] xs:animate-slideFromLeft2 md:animate-slideFromLeft3 md:p-4`}
      >
        <div className="flex flex-col gap-1">
          <GenesisFilter />
          <Dormant />
          <BalanceFilter />
          <AgeFilter />
          <ZeroOutsFilter />
        </div>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="rounded-md border border-black px-3 py-1 text-lg transition-all hover:border-indigo-500 hover:bg-indigo-500 hover:text-white dark:border-gray-600"
          >
            Close
          </button>
          <button
            onClick={onApply}
            className="rounded-md border border-black px-3 py-1 text-base transition-all hover:border-indigo-500 hover:bg-indigo-500 hover:text-white dark:border-gray-600"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;
