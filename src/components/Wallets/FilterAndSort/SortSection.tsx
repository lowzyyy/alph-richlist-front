import React from "react";
import { useRouter } from "next/router";
import { SortAscending, SortDescending } from "@phosphor-icons/react";
// store
import { useAppDispatch, useAppSelector } from "@/src/store/storeHooks";
import { copyState, getCopyQuerySplitSort } from "@/src/store/urlQueriesCopy";
import { setSortOrder } from "@/src/store/urlQueriesSlice";
import { setBalanceType, setGlobalLoading } from "@/src/store/pagesSlice";

function Sort() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sortOrder, queriesWithoutSort } = useAppSelector(getCopyQuerySplitSort);

  const onSelect = (e: any) => {
    const sort =
      e.currentTarget.id === "sort" ? e.currentTarget.value : sortOrder.sortVal;
    let order;
    if (e.currentTarget.hasAttribute("data-order")) {
      order = e.currentTarget.getAttribute("data-order") === "desc" ? "asc" : "desc";
    } else order = sortOrder.orderVal;
    // dispatch(setSortOrder({ sort, order }));
    // dispatch(copyState());
    if (sort === "locked_balance") dispatch(setBalanceType("locked"));
    else dispatch(setBalanceType("usd"));
    dispatch(setGlobalLoading(true));
    router.push(`/pages/1?&sort=${sort}&order=${order}${queriesWithoutSort}`);
  };
  return (
    <div className="flex items-center  rounded-md bg-slate-200 px-3 py-1  dark:bg-slate-800 ">
      <select
        id="sort"
        onChange={onSelect}
        className="cursor-pointer rounded-md bg-inherit  text-sm outline-none [&>*]:text-base"
        value={sortOrder.sortVal}
      >
        <option value={"balance"}>Total balance </option>
        <option value={"locked_balance"}>Locked balance</option>
        <option value={"outs"}>Outputs number</option>
        <option value={"ins"}>Inputs number</option>
      </select>
      <span onClick={onSelect} data-order={sortOrder.orderVal} className="cursor-pointer">
        {sortOrder.orderVal === "desc" ? (
          <SortAscending weight="bold" size={24} />
        ) : (
          <SortDescending weight="bold" size={24} />
        )}
      </span>
    </div>
  );
}

export default Sort;
