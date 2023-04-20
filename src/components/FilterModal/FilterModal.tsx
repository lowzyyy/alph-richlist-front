import React from "react";
import { useRouter } from "next/router";

// store
import { useAppDispatch, useAppSelector } from "@/src/store/storeHooks";
import { setShowModal } from "@/src/store/filterModalSlice";
import { copyState } from "@/src/store/urlQueriesCopy";
import { getQuery, loadSavedQueries } from "@/src/store/urlQueriesSlice";
// components
import GenesisFilter from "./GenesisFilter";
import AgeFilter from "./AgeFilter";
import BalanceFilter from "./BalanceFilter";
import ZeroOutsFilter from "./ZeroOutsFilter";
import Dormant from "./Dormant";
import { setGlobalLoading } from "@/src/store/pagesSlice";

const resetBodySettings = () => {
  document.body.style.overflowY = "auto";
  document.body.style.backgroundColor = `var(--body-default-bg)`;
};

export const filterSliderWidth = "w-28";
function FilterModal() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const combinedQuery = useAppSelector(getQuery);
  // const allQueries = useAppSelector((state) => state.urlQueries);
  // const copy = useAppSelector((state) => state.urlQueriesCopy);
  // console.log("all: ", allQueries);
  // console.log("copy: ", copy);

  // callbacks
  const onModal = (e: any) => {
    if (e.target === e.currentTarget) {
      resetBodySettings();
      dispatch(setShowModal());
    }
  };
  const onClose = () => {
    dispatch(setShowModal());
    dispatch(loadSavedQueries());
    resetBodySettings();
  };

  const onApply = () => {
    dispatch(setShowModal());
    dispatch(setGlobalLoading(true));
    resetBodySettings();
    router.push(`/pages/1?${combinedQuery}`);
  };
  return (
    <div
      onClick={onModal}
      className="fixed top-0 left-0 h-full w-full bg-slate-200 bg-opacity-40 backdrop-blur-[2px] "
    >
      <div
        className={` mx-auto  flex h-[450px] w-[95%] animate-slideFromLeft1 flex-col justify-between rounded-md bg-indigo-50 p-3 shadow-[0_0px_20px_8px_rgba(0,0,0,0.75)] xs:w-[400px] xs:animate-slideFromLeft2 md:animate-slideFromLeft3 md:p-4`}
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
            className="rounded-md border border-black py-1 px-3 text-lg transition-all hover:border-indigo-500 hover:bg-indigo-500 hover:text-white"
          >
            Close
          </button>
          <button
            onClick={onApply}
            className="rounded-md border border-black py-1 px-3 text-base transition-all hover:border-indigo-500 hover:bg-indigo-500 hover:text-white"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;
