import { filterCbColor, filterCbSize } from "@/src/globalHelpers";
import { useAppDispatch, useAppSelector } from "@/src/store/storeHooks";
import { setDormant } from "@/src/store/urlQueriesSlice";
import { CheckSquare, Square } from "@phosphor-icons/react";
import React from "react";
import { filterSliderWidth } from "./FilterModal";

const intervals = ["6m", "1y", "2y"];
function Dormant() {
  const dormant = useAppSelector((state) => state.urlQueries.dormant);
  const dispatch = useAppDispatch();
  const checkbox = dormant.checked ? (
    <CheckSquare size={filterCbSize} weight="fill" className={`${filterCbColor}`} />
  ) : (
    <Square size={filterCbSize} className="dark:text-[--cb-dark]" />
  );
  const onDormant = () => {
    dispatch(setDormant({ dormant: intervals[vDormant], checked: !dormant.checked }));
  };
  const onSlider = (e: any) => {
    dispatch(
      setDormant({ dormant: intervals[+e.target.value], checked: dormant.checked })
    );
  };

  const vDormant = !!dormant.dorVal
    ? intervals.findIndex((el) => el === dormant.dorVal)
    : 0;
  return (
    <div className="p-1">
      <span onClick={onDormant} className="flex">
        {checkbox} Dormant for {`${intervals[vDormant]}`}
      </span>
      <input
        onChange={onSlider}
        className={`${filterSliderWidth} dark:accent-indigo-800`}
        type="range"
        min={0}
        max={2}
        value={vDormant}
      />
    </div>
  );
}

export default Dormant;
