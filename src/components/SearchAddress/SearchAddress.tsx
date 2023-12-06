import React, { useRef, useState } from "react";
import { CircleDashed, MagnifyingGlass } from "@phosphor-icons/react";

//store
import { setShowSearch } from "@/src/store/searchModalSlice";
import { useAppDispatch, useAppSelector } from "@/src/store/storeHooks";
// components
import WalletItem from "../Wallets/WalletItem";
import { useSearchAddress } from "./useSearchAddress";
//helpers
import { getHeight, heights } from "./searchHelpers";

function SearchAddress() {
  const dispatch = useAppDispatch();
  const alphPrice = useAppSelector((state) => state.pages.alphPrice);
  const [address, setAddress] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, error } = useSearchAddress(address);

  // callbacks
  const onModal = (e: any) => {
    if (e.target === e.currentTarget) {
      document.body.style.overflowY = "auto";
      dispatch(setShowSearch());
    }
  };

  const onSubmit = (e: any) => {
    if (e.key === "Enter") setAddress(inputRef.current!.value);
  };
  const onMagnifyingGlass = () => {
    setAddress(inputRef.current!.value);
  };

  const walletInfo =
    data && data.walletInfo ? (
      <WalletItem
        alphPrice={alphPrice}
        w={data.walletInfo}
        walletNumber={data.index as number}
        hidePosition={true}
      />
    ) : null;

  return (
    <div
      onClick={onModal}
      className="fixed left-0 top-0 z-20 h-full w-full bg-slate-200 bg-opacity-40 backdrop-blur-[2px] dark:bg-gray-900 dark:bg-opacity-60 "
    >
      <div
        style={{
          height: `${
            data
              ? getHeight(data.index, data.indexNoGen)
              : window.innerWidth < 768
              ? heights.mobile["low"]
              : heights.big["low"]
          }`,
        }}
        className={`mx-auto flex 
        w-[95%] translate-y-[70px] animate-fadeIn flex-col gap-2 rounded-md bg-indigo-50 shadow-[0_0px_20px_8px_rgba(0,0,0,0.75)] transition-all 
        dark:border dark:border-stone-700  dark:bg-neutral-900 dark:shadow-neutral-900  
        xs:translate-y-[25%] 
        md:translate-y-[30%] md:p-4 
        xl:max-w-[80%] 
        2xl:max-w-[70%]`}
      >
        <div className=" flex w-full p-3 sm:justify-center">
          <div className="relative flex h-10 w-full items-center sm:w-[500px]">
            <input
              ref={inputRef}
              onKeyDown={onSubmit}
              className={`h-full w-full rounded-md border border-black bg-white p-1 px-2 pr-9 outline-none focus:border-2
                        dark:text-black dark:placeholder:text-gray-500 dark:focus:border-stone-700 dark:focus:shadow-[0px_0px_5px_2px_rgba(51,37,36,1)] `}
              type="text"
              placeholder="Search address..."
            />
            <MagnifyingGlass
              onClick={onMagnifyingGlass}
              className="absolute right-2 cursor-pointer dark:text-black"
              size={24}
              weight="duotone"
            />
          </div>
        </div>
        <div className="flex h-full flex-col justify-between">
          <div className="flex justify-between xs:gap-6  sm:justify-normal md:gap-14">
            {data && data.indexNoGen && (
              <span className="px-3 text-sm xs:text-base md:px-0 xl:max-w-[80%] 2xl:max-w-[70%]">
                Without Genesis: {<br />}#
                <span className="font-semibold">{data.indexNoGen}</span>
              </span>
            )}
            {data && data.index && (
              <span className="px-3 text-sm xs:text-base md:px-0 xl:max-w-[80%] 2xl:max-w-[70%]">
                With Genesis: {<br />}#
                <span className="font-semibold">{data.index}</span>
              </span>
            )}
          </div>
          {data && data.walletInfo && (
            <div
              className="mx-auto mb-1 w-[99%] animate-fadeIn rounded-md shadow-[0px_0px_3px_1px_rgba(41,37,36,0.3)]  
            dark:shadow-[0px_0px_3px_2px_rgba(41,37,36,1)] 
            xl:w-full"
            >
              {walletInfo}
            </div>
          )}

          {data && !data.index && !data.indexNoGen && (
            <p className="mb-2 px-3 md:mb-0">No results.</p>
          )}
          {isLoading && (
            <CircleDashed
              className="mx-auto mb-4 animate-spin"
              size={30}
              weight="bold"
            />
          )}
          {error && <p>ERROR CONTACTING SERVER...</p>}
        </div>
      </div>
    </div>
  );
}

export default SearchAddress;
