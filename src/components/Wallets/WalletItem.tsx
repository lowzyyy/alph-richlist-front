import React from "react";
import { Roboto_Mono } from "next/font/google";
import Link from "next/link";
import { Tooltip } from "react-tooltip";
// globals
import {
  ALEPHIUM_EXPLORER,
  ETHERSCAN_ALPH,
  formatInsOuts,
  formatLocked,
  getUsdBalanceString,
} from "@/src/globalHelpers";
// components
import { Wallet } from "./WalletTypes";
import { useAppDispatch, useAppSelector } from "@/src/store/storeHooks";
import { LockSimple } from "@phosphor-icons/react";
import { setBalanceType } from "@/src/store/pagesSlice";

const robMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

type Props = {
  w: Wallet;
  alphPrice: number | null;
  walletNumber: number;
  hidePosition?: boolean;
};

const tagColor = {
  Genesis: "bg-violet-300",
  Pool: "bg-green-500",
  Exchange: "bg-teal-200",
  Reserved: "bg-orange-300",
  Uniswap: "bg-fuchsia-400",
  Other: "bg-blue-400",
};

const walletLen = 18;
function WalletItem({ w, alphPrice, walletNumber, hidePosition }: Props) {
  const balanceType = useAppSelector((state) => state.pages.balanceType);
  const dispatch = useAppDispatch();
  const isItGenesis = w.isGenesis;
  const isItReserved = w.isReserved;

  // tag
  let tagName =
    w.name ?? (isItGenesis ? "Genesis" : isItReserved ? "Reserved" : w.name);

  tagName = tagName ? tagName[0].toUpperCase() + tagName.slice(1) : null;
  let tagType = "Other";
  if (w.type) tagType = w.type;
  else if (tagName === "Genesis") tagType = "Genesis";
  else if (tagName === "Reserved") tagType = "Reserved";
  const tag = tagName && (
    <span
      style={{ fontFamily: `${robMono.style.fontFamily}` }}
      data-tooltip-id="tag"
      data-tooltip-content={`${tagName}`}
      className={`overflow-x-hidden whitespace-nowrap rounded-md p-1 text-xs text-black
                  xl:text-sm  ${
                    tagColor[tagType as keyof typeof tagColor] ?? "bg-blue-400"
                  }`}
    >
      <Tooltip id="tag" openOnClick={window.innerWidth < 1280 ? true : false} />
      {tagName}
    </span>
  );

  // address
  const addressShort =
    w.address.slice(0, walletLen) +
    (walletLen >= w.address.length ? "" : "...");

  // balance
  const balanceHint = w.balanceHint;
  const usdBalance = getUsdBalanceString(w.balance, alphPrice);
  const usdBalanceHint = alphPrice ? `($${usdBalance})` : "";
  const lockedBalanceHint =
    window.innerWidth < 400 ? formatLocked(w.lockedHint) : w.lockedHint;

  // ins and outs
  const ins = formatInsOuts(w.ins, window.innerWidth);
  const outs = formatInsOuts(w.outs, window.innerWidth);
  // tx locale date
  const options: Intl.DateTimeFormatOptions = {
    month: "numeric",
    year: "numeric",
    day: "numeric",
  };
  const lastIn = w.last_tx_recv
    ? new Date(w.last_tx_recv).toLocaleString(undefined, options)
    : "----------";
  const lastOut = w.last_tx_send
    ? new Date(w.last_tx_send).toLocaleString(undefined, options)
    : "----------";
  const firstIn = w.first_tx_recv
    ? new Date(w.first_tx_recv).toLocaleString(undefined, options)
    : "----------";
  const firstOut = w.first_tx_send
    ? new Date(w.first_tx_send).toLocaleString(undefined, options)
    : "----------";

  const onBalance = () => {
    dispatch(setBalanceType(balanceType === "usd" ? "locked" : "usd"));
  };
  return (
    <div
      className={`border-b  border-black bg-stone-50 p-1 text-sm first:rounded-t-md last:rounded-b-md last:border-b-0 
      dark:bg-gray-900 
      xs:flex xs:justify-between xs:p-2 
      lg:text-base
      xl:p-4`}
    >
      <div className="flex min-w-0 flex-shrink flex-col gap-3 xs:w-full xs:gap-2 sm:w-auto  ">
        <span className={`flex justify-between sm:gap-1`}>
          <span className={`flex gap-2 `}>
            {!hidePosition && (
              <span className="font-semibold">{walletNumber}</span>
            )}
            <Link
              href={
                w.type !== "Uniswap"
                  ? `${ALEPHIUM_EXPLORER}/addresses/${w.address}`
                  : `${ETHERSCAN_ALPH}?a=${w.address}`
              }
              target="_blank"
              className={`text-blue-700 hover:text-blue-500 dark:text-amber-600 dark:hover:text-yellow-500 `}
              style={{ fontFamily: `${robMono.style.fontFamily}` }}
            >
              {addressShort}
            </Link>
          </span>
          {tag}
        </span>
        <div className="flex items-center justify-between ">
          <span className="flex gap-1">
            Balance:{" "}
            <span
              onClick={onBalance}
              className="flex cursor-pointer items-center font-medium"
            >
              {`${balanceHint}`}{" "}
              {balanceType === "locked" && lockedBalanceHint !== "0" && (
                <>
                  (
                  <LockSimple
                    size={12}
                    weight="fill"
                    className="text-red-500"
                  />
                  {`${lockedBalanceHint}`})
                </>
              )}
              {balanceType === "usd" && <>{`${usdBalanceHint}`}</>}
            </span>
          </span>
          <span className=" text-xs  xs:text-sm sm:hidden">
            <span className="inline-block w-[70px] border-r border-gray-400 p-1 xs:w-[79px]">{`Ins: ${ins}`}</span>
            <span className="inline-block w-[77px] p-1 xs:w-[88px]">{`Outs: ${outs}`}</span>
          </span>
        </div>
      </div>
      <div className="hidden sm:flex [&>*]:border-r [&>*]:border-gray-400 [&>*]:p-2">
        <div className="flex w-16 flex-col lg:w-20">
          <span>Ins</span>
          <span>{ins}</span>
        </div>
        <div className="flex w-16 flex-col border-none  md:border-solid lg:w-20">
          <span>Outs</span>
          <span>{outs}</span>
        </div>
        <div className="hidden w-24 flex-col lg:flex lg:w-28">
          <span>First In</span>
          <span>{firstIn}</span>
        </div>
        <div className="hidden w-24  flex-col lg:flex lg:w-28">
          <span>First Out</span>
          <span>{firstOut}</span>
        </div>
        <div className="hidden w-24 flex-col md:flex lg:w-28">
          <span>Last In</span>
          <span>{lastIn}</span>
        </div>
        <div className="hidden w-24 flex-col last:border-r-0 md:flex lg:w-28">
          <span>Last Out</span>
          <span>{lastOut}</span>
        </div>
      </div>
    </div>
  );
}

export default WalletItem;
