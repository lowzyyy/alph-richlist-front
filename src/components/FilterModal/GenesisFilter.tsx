import { filterCbColor, filterCbSize } from "@/src/globalHelpers";
import { useAppDispatch, useAppSelector } from "@/src/store/storeHooks";
import { setFilter } from "@/src/store/urlQueriesSlice";
import { CheckSquare, Square } from "@phosphor-icons/react";
import React from "react";

function GenesisFilter() {
  const dispatch = useAppDispatch();
  const genesis = useAppSelector((state) => state.urlQueries.filter);
  const onGenesis = (e: any) => {
    if (genesis.filterVal === e.currentTarget.id)
      dispatch(setFilter({ filter: "", checked: false }));
    else dispatch(setFilter({ filter: e.currentTarget.id, checked: true }));
  };
  // console.log("Genesis: ", genesis);

  const genesisBox =
    genesis.filterVal === "justgenesis" ? (
      <CheckSquare size={filterCbSize} weight="fill" className={`${filterCbColor}`} />
    ) : (
      <Square size={filterCbSize} />
    );
  const allBox =
    genesis.filterVal === "all" ? (
      <CheckSquare size={filterCbSize} weight="fill" className={`${filterCbColor}`} />
    ) : (
      <Square size={filterCbSize} />
    );

  return (
    <div className=" p-1">
      <span onClick={onGenesis} className="flex" id="justgenesis">
        {genesisBox}
        Just genesis
      </span>
      <span onClick={onGenesis} className="flex" id="all">
        {allBox}
        Include Genesis
      </span>
    </div>
  );
}

export default GenesisFilter;
