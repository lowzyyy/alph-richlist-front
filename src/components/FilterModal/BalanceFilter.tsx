import { filterCbColor, filterCbSize } from "@/src/globalHelpers";
import { useAppDispatch, useAppSelector } from "@/src/store/storeHooks";
import { setBalance } from "@/src/store/urlQueriesSlice";
import { CheckSquare, Square } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";

const inputTime = 300;
function BalanceFilter() {
  const dispatch = useAppDispatch();
  const balance = useAppSelector((state) => state.urlQueries.balance);
  const [left, setLeft] = useState<string>(balance.balanceLeftVal);
  const [right, setRight] = useState<string>(balance.balanceRightVal);
  // console.log("Balance: ", balance, left, right);

  const checkBox = balance.checked ? (
    <CheckSquare size={filterCbSize} weight="fill" className={`${filterCbColor}`} />
  ) : (
    <Square size={filterCbSize} />
  );
  // callbacks
  const onBalance = () => {
    if (balance.checked)
      dispatch(
        setBalance({
          balanceLeftVal: balance.balanceLeftVal,
          balanceRightVal: balance.balanceRightVal,
          checked: false,
        })
      );
    else
      dispatch(
        setBalance({
          balanceLeftVal: balance.balanceLeftVal,
          balanceRightVal: balance.balanceRightVal,
          checked: true,
        })
      );
  };
  const onInputLeft = (e: any) => {
    const value = e.currentTarget.value;
    setLeft(value);
  };
  const onInputRight = (e: any) => {
    const value = e.currentTarget.value;
    setRight(value);
  };
  // useEffect
  useEffect(() => {
    // left balance field
    const timeout = setTimeout(() => {
      const value = left;
      dispatch(
        setBalance({
          balanceLeftVal: `${value}`,
          balanceRightVal: `${balance.balanceRightVal}`,
          checked: balance.checked,
        })
      );
    }, inputTime);
    return () => clearTimeout(timeout);
  }, [left]);
  useEffect(() => {
    // right balance field
    const timeout = setTimeout(() => {
      const value = right;
      dispatch(
        setBalance({
          balanceLeftVal: `${balance.balanceLeftVal}`,
          balanceRightVal: `${value}`,
          checked: balance.checked,
        })
      );
    }, inputTime);
    return () => clearTimeout(timeout);
  }, [right]);

  const testL = isValid(left);
  const testR = isValid(right);
  return (
    <div className=" p-1">
      <span onClick={onBalance} className="mb-1 flex">
        {checkBox} Balance
      </span>
      <div className="flex items-center gap-2 ">
        <input
          onChange={onInputLeft}
          maxLength={8}
          className={`w-24 rounded-md border p-1 text-center outline-none  ${
            testL ? "border-red-600" : "border-slate-800"
          }`}
          value={left}
        />
        -
        <input
          onChange={onInputRight}
          maxLength={8}
          className={`w-24 rounded-md border p-1 text-center outline-none ${
            testR ? "border-red-600" : "border-slate-800"
          }`}
          value={right}
        />
      </div>
    </div>
  );
}

const isValid = (valueBalance: string) => {
  const normal = /^(?<Normal>\d+$)/i;
  const short = /^(?<Short>\d+)(?<Multi>k|m)$/i;
  return !(normal.test(valueBalance) || short.test(valueBalance));
};

export default BalanceFilter;
