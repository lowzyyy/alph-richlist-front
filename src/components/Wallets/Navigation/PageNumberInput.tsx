import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  pageNumber: number;
  queryMode: string;
  maxPage: number;
};
function PageNumberInput({ pageNumber, queryMode, maxPage }: Props) {
  const maxPageSize = queryMode === "default" ? 100 : maxPage;
  const [pageNum, setPageNum] = useState<string>(pageNumber + "");
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
    else if (inputNum > 100) inputNum = 100;
    inputRef.current.value = "";
    router.push(`/pages/${inputNum}`);
  };

  return (
    <form onSubmit={submitCallback}>
      <input
        type="text"
        inputMode="numeric"
        maxLength={3}
        ref={inputRef}
        onChange={inputChange}
        className={`w-9 rounded-md border-2 text-center focus:outline-none ${
          validInput ? "border-black" : "border-red-500"
        }`}
        value={pageNum}
      />
      {`  /${maxPageSize}`}
      <input type="submit" className="hidden" />
    </form>
  );
}

export default PageNumberInput;
