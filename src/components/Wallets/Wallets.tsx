import React, { ReactNode, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";

// components
import WalletsList from "./WalletsList";
import WalletsSkeleton from "./WalletsSkeleton";
import FilterSection from "./FilterAndSort/FilterAndSortSection";
import Navigation from "./Navigation/Navigation";
// helpers
import { Wallet } from "./WalletTypes";
// store
import { useAppDispatch, useAppSelector } from "@/src/store/storeHooks";
import { getCopyQuery } from "@/src/store/urlQueriesCopySlice";
import {
  setAlphPrice,
  setGlobalLoading,
  setPageEnd,
} from "@/src/store/pagesSlice";
import { useGetAddresses } from "./hooks/useGetAddresses";
import { useGetAlphPrice } from "./hooks/useGetAlphPrice";

type Props = {
  children?: ReactNode;
  wallets?: Wallet[];
  pageNum: number;
};

function Wallets({ pageNum }: Props) {
  const combinedCopyQuery = useAppSelector(getCopyQuery);
  const maximumPage = useAppSelector((state) => state.pages.pageEnd);
  const globalLoading = useAppSelector((state) => state.pages.globalLoading);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // GET ADDRESSES
  const {
    data,
    isLoading,
    error: errorAddresses,
  } = useGetAddresses(pageNum, combinedCopyQuery);
  // GET ALPH PRICE
  const { data: alphPrice, isLoading: isLoadingPrice } = useGetAlphPrice();
  // set Maximum navigation page
  useEffect(() => {
    if (data) {
      dispatch(setGlobalLoading(false));
      const numberOfResults =
        data.active_addresses > 10_000
          ? 100
          : Math.ceil(data.active_addresses ? data.active_addresses / 100 : 1);
      if (pageNum > numberOfResults) router.push("/404");
      if (!maximumPage || pageNum === 1) dispatch(setPageEnd(numberOfResults));
    }
  }, [data]);
  useEffect(() => {
    if (alphPrice) dispatch(setAlphPrice(alphPrice));
  }, [alphPrice]);

  if (isLoading || isLoadingPrice) return <WalletsSkeleton />;
  if (!isLoading && !isLoadingPrice && globalLoading)
    return <WalletsSkeleton />;

  if (errorAddresses) return <p>Error loading addresses</p>;
  return (
    <div>
      <Navigation pageNumber={pageNum} />
      <FilterSection />
      {!!data?.active_addresses && (
        <WalletsList
          wallets={data?.addresses as Wallet[]}
          alphPrice={alphPrice as number}
          // alphPrice={0.25}
          pageNumber={pageNum}
        ></WalletsList>
      )}
      {data?.active_addresses === 0 && (
        <p className="h-20 rounded-md border border-black p-2">
          0 results match this query.
        </p>
      )}
      <Navigation pageNumber={pageNum} />

      <div className="mb-2 mt-3 sm:flex sm:justify-between">
        <p className=" text-xs text-slate-800 dark:text-inherit xs:text-sm">
          Powered by{" "}
          <a
            className="font-semibold text-cyan-600"
            href="https://www.coingecko.com/en/api"
          >
            CoinGecko API
          </a>
        </p>
        <p className=" text-xs text-slate-800 dark:text-inherit xs:text-sm">
          Updated: {data?.last_update}
        </p>
      </div>
    </div>
  );
}

export default Wallets;
