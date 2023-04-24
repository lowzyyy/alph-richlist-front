import React from "react";
import { useRouter } from "next/router";
import { FadersHorizontal } from "@phosphor-icons/react";

// store
import { useAppDispatch, useAppSelector } from "@/src/store/storeHooks";
import { setShowModal } from "@/src/store/filterModalSlice";
import { resetBalanceType, setGlobalLoading } from "@/src/store/pagesSlice";

function Filter() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.pages.theme);

  const onReset = () => {
    dispatch(resetBalanceType());
    dispatch(setGlobalLoading(true));
    router.asPath === "/" || router.asPath === "/pages/1"
      ? router.reload()
      : router.push("/pages/1");
  };

  const onFilter = () => {
    document.body.style.overflowY = "hidden";
    document.body.style.backgroundColor =
      theme === "white" ? `var(--body-filter-bg-white)` : `var(--body-filter-bg-dark)`;
    dispatch(setShowModal());
  };
  return (
    <div className="flex items-center gap-6  rounded-md bg-slate-200 px-3 py-1 dark:bg-gray-900">
      <div onClick={onFilter} className="flex cursor-pointer items-center">
        <FadersHorizontal weight="bold"></FadersHorizontal>
        <span className="text-sm">Filters</span>
      </div>
      <button onClick={onReset} className={`text-sm`}>
        Reset
      </button>
    </div>
  );
}

export default Filter;
