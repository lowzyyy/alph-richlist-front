import React, { MutableRefObject, useRef, useState } from "react";
import { FadersHorizontal, Funnel } from "phosphor-react";
import { useRouter } from "next/router";

type Props = {
  order: string | undefined;
  sort: string | undefined;
};

function FilterSection({ order, sort }: Props) {
  const router = useRouter();
  const [v, setV] = useState(`${sort} ${order}`);
  const onSelect = (e: any) => {
    const [sort, order] = e.target.value.split(" ");
    setV(e.target.value);
    router.push(`/pages/1?sort=${sort}&order=${order}`);
  };
  return (
    <div className="mb-2 flex justify-between">
      <span className="inline-flex items-center  rounded-md bg-slate-200 px-2 py-1">
        <span className="text-sm">Filters</span>
        <FadersHorizontal weight="bold"></FadersHorizontal>
      </span>
      <span className="inline-flex items-center  rounded-md bg-slate-200 px-2  py-1 ">
        <span>
          <Funnel weight="bold"></Funnel>
        </span>
        <select
          id="sort"
          onChange={onSelect}
          className=" rounded-md bg-inherit text-sm [&>*]:text-base"
          value={v}
        >
          <option>balance desc</option>
          <option>balance asc</option>
          <option>ins desc</option>
          <option>ins asc</option>
          <option>outs desc</option>
          <option>outs asc</option>
        </select>
      </span>
    </div>
  );
}

export default FilterSection;
