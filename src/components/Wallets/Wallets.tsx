import React, { ReactNode, useCallback, useEffect, useState } from "react";
import useSWR from "swr";

// components
import WalletsList from "./WalletsList";
// helpers
import { Wallet, Addresses } from "./WalletTypes";

import WalletsSkeleton from "./WalletsSkeleton";

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

function Wallets({ pageNum, STATS_API }: Props) {
  const [walletWidth, setWalletWidth] = useState(wallWith.mobile);
  const {
    data,
    isLoading,
    error: errorAddresses,
  } = useSWR<Addresses>(`${STATS_API}/addresses?page=${pageNum}&size=100`, (url) =>
    fetch(url, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    }).then((res) => res.json())
  );
  const { data: alphPrice, isLoading: isLoadingPrice } = useSWR<number>(
    "https://api.coingecko.com/api/v3/coins/alephium",
    (url) =>
      fetch(url).then(async (res) => {
        const info = await res.json();
        return info.market_data.current_price.usd;
      })
  );
  if (isLoading || isLoadingPrice) return <WalletsSkeleton></WalletsSkeleton>;
  // if (isLoading) return <WalletsSkeleton></WalletsSkeleton>;
  if (errorAddresses) return <p>Error loading addresses</p>;
  return (
    <div>
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
      <WalletsList
        wallets={data?.addresses as Wallet[]}
        walletLen={walletWidth}
        alphPrice={alphPrice as number}
        // alphPrice={0.25}
        pageNumber={pageNum}
      ></WalletsList>
    </div>
  );
}

export default Wallets;
