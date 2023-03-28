import { useRouter } from "next/router";
import {
  CaretCircleDoubleRight,
  CaretCircleDoubleLeft,
  CaretCircleLeft,
  CaretCircleRight,
} from "phosphor-react";

import React from "react";
import PageNumberInput from "./PageNumberInput";

type Props = {
  pageNumber: number;
  queryMode: string;
};

enum NavDir {
  forward,
  backward,
  start,
  end,
}

const pageStart = 1;
const pageEnd = 100;

function Navigation({ pageNumber, queryMode }: Props) {
  const router = useRouter();
  let queryString = "";
  const { sort, order } = router.query;
  if (sort && order) {
    queryString = `?sort=${sort}&order=${order}`;
  } else if (sort && !order) queryString = `?sort=${sort}&order=desc`;

  // callbacks
  const pageCallback = (e: any) => {
    switch (+e.currentTarget.dataset.dir) {
      case NavDir.backward:
        router.push(
          `/pages/${pageNumber === pageStart ? 1 : pageNumber - 1}${queryString}`
        );
        break;
      case NavDir.forward:
        router.push(
          `/pages/${pageNumber === pageEnd ? 100 : pageNumber + 1}${queryString}`
        );
        break;
      case NavDir.start:
        router.push(`/pages/1${queryString}`);
        break;
      case NavDir.end:
        router.push(`/pages/100${queryString}`);
      default:
        break;
    }
  };

  return (
    <div className="mx-auto my-2 w-72">
      <nav className="flex items-center justify-between">
        <div className="flex gap-4">
          <span
            role={"button"}
            aria-disabled={pageNumber === pageStart ? true : false}
            className={`hover:cursor-pointer aria-disabled:pointer-events-none aria-disabled:text-gray-300  aria-disabled:hover:cursor-default`}
            onClick={pageCallback}
            data-dir={NavDir.start}
          >
            <CaretCircleDoubleLeft
              size={32}
              className="[&>circle]:transition-all  [&>circle]:hover:fill-gray-200 [&>circle]:hover:stroke-[20] [&>polyline]:hover:stroke-[20]"
            />
          </span>
          <span
            aria-disabled={pageNumber === pageStart ? true : false}
            className={`hover:cursor-pointer aria-disabled:pointer-events-none aria-disabled:text-gray-300  aria-disabled:hover:cursor-default`}
            onClick={pageCallback}
            data-dir={NavDir.backward}
          >
            <CaretCircleLeft
              size={32}
              className="[&>circle]:transition-all  [&>circle]:hover:fill-gray-200 [&>circle]:hover:stroke-[20] [&>polyline]:hover:stroke-[20]"
            />
          </span>
        </div>

        <PageNumberInput
          pageNumber={pageNumber}
          queryMode={queryMode}
          maxPage={120}
        ></PageNumberInput>

        <div className="flex gap-4">
          <span
            aria-disabled={pageNumber === pageEnd ? true : false}
            className={`hover:cursor-pointer aria-disabled:pointer-events-none aria-disabled:text-gray-300  aria-disabled:hover:cursor-default`}
            onClick={pageCallback}
            data-dir={NavDir.forward}
          >
            <CaretCircleRight
              size={32}
              className="[&>circle]:transition-all  [&>circle]:hover:fill-gray-200 [&>circle]:hover:stroke-[20] [&>polyline]:hover:stroke-[20]"
            />
          </span>
          <span
            aria-disabled={pageNumber === pageEnd ? true : false}
            className={`hover:cursor-pointer aria-disabled:pointer-events-none aria-disabled:text-gray-300  aria-disabled:hover:cursor-default`}
            onClick={pageCallback}
            data-dir={NavDir.end}
          >
            <CaretCircleDoubleRight
              size={32}
              className="[&>circle]:transition-all  [&>circle]:hover:fill-gray-200 [&>circle]:hover:stroke-[20] [&>polyline]:hover:stroke-[20]"
            />
          </span>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
