import {
  ALEPHIUM_EXPLORER,
  genesis_addresses,
  getUsdBalanceString,
} from "@/src/globalHelpers";
import { Roboto_Mono } from "next/font/google";
import Link from "next/link";
import React from "react";
// my imports
import { Wallet } from "./WalletTypes";

const robMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

type Props = {
  w: Wallet;
  walletLen: number;
  alphPrice: number;
  walletNumber: number;
};

const tagColor = {
  Genesis: "bg-violet-300",
  Pool: "bg-green-400",
  Exchange: "bg-rose-400",
  Other: "bg-blue-400",
};

const formatInsOuts = (amount: number) => {
  if (amount > 1_000_000) return (amount / 1_000_000).toFixed(1) + "M";
  if (amount > 1_000) return (amount / 1_000).toFixed(1) + "K";
  return amount;
};

function WalletItem({ w, walletLen, alphPrice, walletNumber }: Props) {
  const usdBalance = getUsdBalanceString(w.balance, alphPrice);
  const isItGenesis = w.isGenesis;

  //tagName
  let tagName =
    w.name && w.name.includes(".com")
      ? w.name.replace(".com", "")
      : w.name
      ? w.name
      : isItGenesis
      ? "Genesis"
      : null;
  tagName = tagName ? tagName[0].toUpperCase() + tagName.slice(1) : null;
  let tagType = "Other";
  if (w.type) tagType = w.type;
  else if (tagName === "Genesis") tagType = "Genesis";

  // address
  const addressShort =
    w.address.slice(0, walletLen) + (walletLen >= w.address.length ? "" : "...");

  const balanceHint = w.balanceHint;
  const tag = tagName && (
    <span
      className={` rounded-md p-1  text-xs text-black xl:text-sm  ${
        tagColor[tagType as keyof typeof tagColor]
      }`}
    >
      {tagName}
    </span>
  );
  // ins and outs
  const ins = formatInsOuts(w.ins);
  const outs = formatInsOuts(w.outs);
  // tx locale date
  const options: Intl.DateTimeFormatOptions = {
    month: "numeric",
    year: "numeric",
    day: "numeric",
  };
  const lastIn = new Date(w.last_tx_recv).toLocaleString(undefined, options);
  const lastOut = w.last_tx_send
    ? new Date(w.last_tx_send).toLocaleString(undefined, options)
    : "----------";
  const firstIn = new Date(w.first_tx_recv).toLocaleString(undefined, options);
  const firstOut = w.first_tx_send
    ? new Date(w.first_tx_send).toLocaleString(undefined, options)
    : "----------";
  return (
    <div
      className={`border-b  border-black bg-stone-50 p-1 text-sm first:rounded-t-md last:rounded-b-md last:border-b-0 xs:flex xs:justify-between xs:p-2 lg:text-base xl:p-4`}
    >
      <div className="flex flex-col gap-2 xs:w-full sm:w-auto">
        <span className={`flex justify-between sm:gap-1`}>
          <span className={`flex gap-2 `}>
            <span className="font-semibold">{walletNumber}</span>
            <Link
              href={`${ALEPHIUM_EXPLORER}/addresses/${w.address}`}
              target="_blank"
              className={`text-blue-700 hover:text-blue-500 `}
              style={{ fontFamily: `${robMono.style.fontFamily}` }}
            >
              {addressShort}
            </Link>
          </span>
          <span>{tag}</span>
        </span>
        <div className="flex items-center justify-between ">
          <span>
            Balance:{" "}
            <span className="font-medium">{`${balanceHint} ${
              alphPrice ? `($${usdBalance})` : ""
            }`}</span>
          </span>
          <span className=" text-xs  xs:text-sm sm:hidden">
            <span className="inline-block w-[70px] border-r border-gray-400 p-1 xs:w-[79px]">{`Ins: ${ins}`}</span>
            <span className="inline-block w-[77px] p-1 xs:w-[88px]">{`Outs: ${outs}`}</span>
          </span>
        </div>
      </div>
      <div className=" [&>*]:  hidden sm:flex [&>*]:border-r [&>*]:border-gray-400 [&>*]:p-2">
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
