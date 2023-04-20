import React, { ReactNode, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";

// components
import WalletsList from "./WalletsList";
import WalletsSkeleton from "./WalletsSkeleton";
import FilterSection from "./FilterAndSort/FilterAndSortSection";
import Navigation from "./Navigation/Navigation";
// helpers
import { Wallet, Addresses } from "./WalletTypes";
// store
import { useAppDispatch, useAppSelector } from "@/src/store/storeHooks";
import { getCopyQuery } from "@/src/store/urlQueriesCopy";
import { setGlobalLoading, setPageEnd } from "@/src/store/pagesSlice";

type Props = {
  children?: ReactNode;
  wallets?: Wallet[];
  pageNum: number;
  STATS_API: string;
};

const walletWidth = 18;
function Wallets({ pageNum, STATS_API }: Props) {
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
  } = useSWR<Addresses>(
    `${STATS_API}/addresses?page=${pageNum}${combinedCopyQuery}`,
    (url) =>
      fetch(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }).then((res) => res.json())
  );
  // GET ALPH PRICE
  const { data: alphPrice, isLoading: isLoadingPrice } = useSWR<number>(
    "https://api.coingecko.com/api/v3/coins/alephium",
    (url) =>
      fetch(url).then(async (res) => {
        const info = await res.json();
        return info.market_data.current_price.usd;
      }),
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Never retry on 404/403
        if (error.status === 404) return;
        if (error.status === 403) return;
        // Only retry up to 3 times.
        if (retryCount >= 3) return;
        // Retry after 5 seconds.
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    }
  );

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

  if (isLoading || isLoadingPrice) return <WalletsSkeleton />;
  if (!isLoading && !isLoadingPrice && globalLoading) return <WalletsSkeleton />;
  if (errorAddresses) return <p>Error loading addresses</p>;
  return (
    <div>
      <Navigation pageNumber={pageNum} />
      <FilterSection />
      {!!data?.active_addresses && (
        <WalletsList
          wallets={data?.addresses as Wallet[]}
          walletLen={walletWidth}
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
        <p className=" text-xs text-slate-800 xs:text-sm">
          Powered by{" "}
          <a
            className="font-semibold text-cyan-600"
            href="https://www.coingecko.com/en/api"
          >
            CoinGecko API
          </a>
        </p>
        <p className=" text-xs text-slate-800 xs:text-sm">Updated: {data?.last_update}</p>
      </div>
    </div>
  );
}

export default Wallets;
