import { filterCbColor, filterCbSize } from "@/src/globalHelpers";
import { useAppDispatch, useAppSelector } from "@/src/store/storeHooks";
import { setZeroOuts } from "@/src/store/urlQueriesSlice";
import { CheckSquare, Square } from "@phosphor-icons/react";
import React from "react";

function ZeroOutsFilter() {
  const zeroOuts = useAppSelector((state) => state.urlQueries.zeroOuts);
  const dispatch = useAppDispatch();

  const onZero = () => {
    dispatch(setZeroOuts({ checked: !zeroOuts.checked }));
  };
  const checkBox = zeroOuts.checked ? (
    <CheckSquare size={filterCbSize} weight="fill" className={`${filterCbColor}`} />
  ) : (
    <Square size={filterCbSize} className="dark:text-[--cb-dark]" />
  );
  return (
    <div onClick={onZero} className="flex  p-1">
      {checkBox} Zero outs
    </div>
  );
}

export default ZeroOutsFilter;
