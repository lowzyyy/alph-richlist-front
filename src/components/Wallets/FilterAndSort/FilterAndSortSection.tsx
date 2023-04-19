import React from "react";
// components
import Filter from "./FilterSection";
import Sort from "./SortSection";

function FilterSection() {
  return (
    <div className="mb-2 flex justify-between">
      <Filter />
      <Sort />
    </div>
  );
}

export default FilterSection;
