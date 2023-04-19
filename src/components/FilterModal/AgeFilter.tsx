import { filterCbColor, filterCbSize } from "@/src/globalHelpers";
import { useAppDispatch, useAppSelector } from "@/src/store/storeHooks";
import { setAge } from "@/src/store/urlQueriesSlice";
import { CheckSquare, Square } from "@phosphor-icons/react";
import React, { useRef } from "react";
import { filterSliderWidth } from "./FilterModal";

function AgeFilter() {
  const age = useAppSelector((state) => state.urlQueries.age);
  // const copy = useAppSelector((state) => state.urlQueriesCopy);
  const lessRef = useRef<HTMLInputElement>(null);
  const greaterRef = useRef<HTMLInputElement>(null);
  const intervals = ["1w", "1m", "6m", "1y", "2y"];

  const dispatch = useAppDispatch();
  // console.log("Age:", age);
  const onSlider = (e: any) => {
    if (e.target.id === "less") {
      const lessValue = +e.target.value;
      // if it's checked than dispatch on overy slider move
      dispatch(setAge({ age: `<=${intervals[lessValue]}`, checked: age.checked }));
    }
    if (e.target.id === "greater") {
      const greaterValue = +e.target.value;
      // if it's checked than dispatch on overy slider move
      dispatch(setAge({ age: `>=${intervals[greaterValue]}`, checked: age.checked }));
    }
  };
  const onAge = (e: any) => {
    if (e.currentTarget.id === ">=") {
      // uncheck if its already checked
      if (age.ageVal.startsWith(">=") && age.checked)
        dispatch(setAge({ age: age.ageVal, checked: false }));
      // check if its not checked
      else
        dispatch(
          setAge({
            age: `>=${intervals[+(greaterRef?.current?.value as string)]}`,
            checked: true,
          })
        );
    } else {
      // uncheck if its already checked
      if (age.ageVal.startsWith("<=") && age.checked)
        dispatch(setAge({ age: age.ageVal, checked: false }));
      // check if its not checked
      else
        dispatch(
          setAge({
            age: `<=${intervals[+(lessRef?.current?.value as string)]}`,
            checked: true,
          })
        );
    }
  };

  const ageLessBox =
    age.ageVal.startsWith("<=") && age.checked ? (
      <CheckSquare size={filterCbSize} weight="fill" className={`${filterCbColor}`} />
    ) : (
      <Square size={filterCbSize} />
    );
  const ageGreaterBox =
    age.ageVal.startsWith(">=") && age.checked ? (
      <CheckSquare size={filterCbSize} weight="fill" className={`${filterCbColor}`} />
    ) : (
      <Square size={filterCbSize} />
    );

  const vLess = lessRef.current
    ? +(lessRef.current.value as string)
    : age.ageVal.startsWith("<=")
    ? intervals.findIndex((el) => el === age.ageVal.slice(2))
    : 0;
  const vGreater = greaterRef.current
    ? +(greaterRef.current.value as string)
    : age.ageVal.startsWith(">=")
    ? intervals.findIndex((el) => el === age.ageVal.slice(2))
    : 0;
  return (
    <div className="p-1">
      <span>
        <span onClick={onAge} className="flex" id="<=">
          {ageLessBox} Age &#8804; {intervals[vLess]}
        </span>
        <input
          ref={lessRef}
          onChange={onSlider}
          type="range"
          min="0"
          max="4"
          className={`${filterSliderWidth}`}
          id="less"
          value={vLess}
        />
      </span>
      <span>
        <span onClick={onAge} className="flex" id=">=">
          {ageGreaterBox} Age &#8805; {intervals[vGreater]}
        </span>
        <input
          ref={greaterRef}
          onChange={onSlider}
          type="range"
          min="0"
          max="4"
          className={`${filterSliderWidth}`}
          id="greater"
          value={vGreater}
        />
      </span>
    </div>
  );
}

export default AgeFilter;
