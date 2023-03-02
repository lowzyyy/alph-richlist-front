import React, { ReactNode, useCallback, useEffect, useState } from "react";
import useSWR from "swr";

// components
import WalletsList from "./WalletsList";
// helpers
import { Wallet, Addresses } from "./WalletTypes";

import { STATS_API } from "@/src/globalHelpers";
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
};

function Wallets({ pageNum }: Props) {
  const [walletWidth, setWalletWidth] = useState(wallWith.mobile);

  const {
    data,
    isLoading,
    error: errorAddresses,
  } = useSWR<Addresses>(`${STATS_API}?page=${pageNum}&size=100`, (url) =>
    fetch(url).then((res) => res.json())
  );
  const { data: alphPrice, isLoading: isLoadingPrice } = useSWR<number>(
    "https://api.coingecko.com/api/v3/coins/alephium",
    (url) =>
      fetch(url).then(async (res) => {
        const info = await res.json();
        return info.market_data.current_price.usd;
      })
  );

  useEffect(() => {
    window.addEventListener("resize", resizeListener);
    resizeListener();
    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  const resizeListener = useCallback(() => {
    if (window.innerWidth < screenWidth.mobilePort) setWalletWidth(wallWith.mobile);
    else if (
      window.innerWidth < screenWidth.tabletSmall &&
      window.innerWidth >= screenWidth.mobilePort
    )
      setWalletWidth(wallWith.tablet);
    else setWalletWidth(wallWith.other);
  }, []);

  if (isLoading || isLoadingPrice) return <WalletsSkeleton></WalletsSkeleton>;
  if (errorAddresses) return <p>Error loading addresses</p>;
  return (
    <div>
      <WalletsList
        wallets={data?.addresses as Wallet[]}
        walletLen={walletWidth}
        alphPrice={alphPrice as number}
        pageNumber={pageNum}
      ></WalletsList>
    </div>
  );
}

export default Wallets;
