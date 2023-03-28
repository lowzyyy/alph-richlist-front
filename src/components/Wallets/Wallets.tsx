import React, { ReactNode, useCallback, useEffect, useState } from "react";
import useSWR from "swr";

// components
import WalletsList from "./WalletsList";
// helpers
import { Wallet, Addresses } from "./WalletTypes";

import WalletsSkeleton from "./WalletsSkeleton";
import FilterSection from "./Filter/FilterSection";
import { useRouter } from "next/router";

enum screenWidth {
  mobilePort = 450,
  mobile = 640,
  tabletSmall = 768,
  tabletBigger = 1024,
  pc = 1280,
}
enum wallWith {
  mobile = 18,
  tablet = 18, //24
  other = 18, //41
}
type Props = {
  children?: ReactNode;
  wallets?: Wallet[];
  pageNum: number;
  STATS_API: string;
};

const sortQueryString = (sort: string | undefined, order: string | undefined) => {
  if (sort && order) return `&sort=${sort}&order=${order}`;
  else if (sort && !order) return `&sort=${sort}&order=desc`;
  else "";
};

function Wallets({ pageNum, STATS_API }: Props) {
  const [walletWidth, setWalletWidth] = useState(wallWith.mobile);
  const router = useRouter();
  const { sort, order } = router.query;
  const {
    data,
    isLoading,
    error: errorAddresses,
  } = useSWR<Addresses>(
    `${STATS_API}/addresses?page=${pageNum}${sortQueryString(
      sort as string | undefined,
      order as string | undefined
    )}`,
    (url) =>
      fetch(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }).then((res) => res.json())
  );
  // const { data: alphPrice, isLoading: isLoadingPrice } = useSWR<number>(
  //   "https://api.coingecko.com/api/v3/coins/alephium",
  //   (url) =>
  //     fetch(url).then(async (res) => {
  //       const info = await res.json();
  //       return info.market_data.current_price.usd;
  //     }),
  //   {
  //     onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
  //       // Never retry on 404/403
  //       if (error.status === 404) return;
  //       if (error.status === 403) return;

  //       // Only retry up to 3 times.
  //       if (retryCount >= 3) return;

  //       // Retry after 5 seconds.
  //       setTimeout(() => revalidate({ retryCount }), 5000);
  //     },
  //   }
  // );
  // if (isLoading || isLoadingPrice) return <WalletsSkeleton></WalletsSkeleton>;
  if (isLoading) return <WalletsSkeleton></WalletsSkeleton>;
  if (errorAddresses) return <p>Error loading addresses</p>;
  return (
    <div>
      <FilterSection sort={sort as string} order={order as string}></FilterSection>
      <WalletsList
        wallets={data?.addresses as Wallet[]}
        walletLen={walletWidth}
        // alphPrice={alphPrice as number}
        alphPrice={0.25}
        pageNumber={pageNum}
      ></WalletsList>
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
