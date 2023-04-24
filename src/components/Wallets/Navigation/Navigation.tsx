import React from "react";
import { NextRouter, useRouter } from "next/router";
import {
  CaretCircleDoubleRight,
  CaretCircleDoubleLeft,
  CaretCircleLeft,
  CaretCircleRight,
} from "@phosphor-icons/react";

// components
import PageNumberInput from "./PageNumberInput";
// store
import { useAppDispatch, useAppSelector } from "@/src/store/storeHooks";
import { getCopyQuery } from "@/src/store/urlQueriesCopy";
import { setGlobalLoading } from "@/src/store/pagesSlice";

type Props = {
  pageNumber: number;
};

enum NavDir {
  forward,
  backward,
  start,
  end,
}

const pageStart = 1;
function Navigation({ pageNumber }: Props) {
  const router = useRouter();
  const allQueries = useAppSelector(getCopyQuery);
  const pageEnd = useAppSelector((state) => state.pages.pageEnd);
  const dispatch = useAppDispatch();
  // callbacks
  const pageCallback = (e: any) => {
    switch (+e.currentTarget.dataset.dir) {
      case NavDir.backward:
        router.push(`/pages/${pageNumber - 1}?${allQueries}`);
        dispatch(setGlobalLoading(true));
        break;
      case NavDir.forward:
        router.push(`/pages/${pageNumber + 1}?${allQueries}`);
        dispatch(setGlobalLoading(true));
        break;
      case NavDir.start:
        router.push(`/pages/1?${allQueries}`);
        dispatch(setGlobalLoading(true));
        break;
      case NavDir.end:
        router.push(`/pages/${pageEnd}?${allQueries}`);
        dispatch(setGlobalLoading(true));
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
            className={`hover:cursor-pointer aria-disabled:pointer-events-none aria-disabled:text-gray-300 aria-disabled:hover:cursor-default  dark:aria-disabled:text-gray-700`}
            onClick={pageCallback}
            data-dir={NavDir.start}
          >
            <CaretCircleDoubleLeft
              size={32}
              className="transition-all xl:hover:text-indigo-800"
            />
          </span>
          <span
            aria-disabled={pageNumber === pageStart ? true : false}
            className={`hover:cursor-pointer aria-disabled:pointer-events-none aria-disabled:text-gray-300  aria-disabled:hover:cursor-default dark:aria-disabled:text-gray-700`}
            onClick={pageCallback}
            data-dir={NavDir.backward}
          >
            <CaretCircleLeft
              size={32}
              className="transition-all xl:hover:text-indigo-800"
            />
          </span>
        </div>

        <PageNumberInput
          pageNumber={pageNumber}
          maxPage={pageEnd as number}
        ></PageNumberInput>

        <div className="flex gap-4">
          <span
            aria-disabled={pageNumber === pageEnd ? true : false}
            className={`hover:cursor-pointer aria-disabled:pointer-events-none aria-disabled:text-gray-300  aria-disabled:hover:cursor-default dark:aria-disabled:text-gray-700`}
            onClick={pageCallback}
            data-dir={NavDir.forward}
          >
            <CaretCircleRight
              size={32}
              className="transition-all xl:hover:text-indigo-800"
            />
          </span>
          <span
            aria-disabled={pageNumber === pageEnd ? true : false}
            className={`hover:cursor-pointer aria-disabled:pointer-events-none aria-disabled:text-gray-300  aria-disabled:hover:cursor-default dark:aria-disabled:text-gray-700`}
            onClick={pageCallback}
            data-dir={NavDir.end}
          >
            <CaretCircleDoubleRight
              size={32}
              className="transition-all xl:hover:text-indigo-800"
            />
          </span>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
