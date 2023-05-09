import { useAppSelector } from "@/src/store/storeHooks";
import { getCopyQuery } from "@/src/store/urlQueriesCopySlice";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  pageNumber: number;
  maxPage: number;
};
function PageNumberInput({ pageNumber, maxPage }: Props) {
  const [pageNum, setPageNum] = useState<string>(pageNumber + "");
  const combinedQuery = useAppSelector(getCopyQuery);
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const validInput = +pageNum && +pageNum > 0;
  const router = useRouter();

  useEffect(() => {
    setPageNum(pageNumber + "");
  }, [pageNumber]);
  // callbacks
  const inputChange = (e: any) => {
    setPageNum(e.target.value);
  };
  const submitCallback = (e: any) => {
    e.preventDefault();

    if (!validInput) return;
    let inputNum = parseInt(pageNum);
    if (inputNum < 0) inputNum = 1;
    else if (inputNum > maxPage) {
      inputNum = maxPage;
    }
    if (inputNum === pageNumber) return;
    inputRef.current.value = "";
    router.push(`/pages/${inputNum}?${combinedQuery}`);
  };

  return (
    <form onSubmit={submitCallback}>
      <input
        type="text"
        inputMode="numeric"
        maxLength={3}
        ref={inputRef}
        onChange={inputChange}
        className={`w-9 rounded-md border-2 text-center focus:outline-none dark:bg-gray-600 dark:text-white ${
          validInput ? "border-black dark:border-gray-900" : "border-red-500"
        }`}
        value={pageNum}
      />
      {`  /${maxPage}`}
      <input type="submit" className="hidden" />
    </form>
  );
}

export default PageNumberInput;
