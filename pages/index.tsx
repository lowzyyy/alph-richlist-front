import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// store
import { useAppDispatch, useAppSelector } from "@/src/store/storeHooks";
import { setAllQueriesURL } from "@/src/store/urlQueriesSlice";
import { copyState } from "@/src/store/urlQueriesCopySlice";

// components
import Wallets from "../src/components/Wallets/Wallets";
import Holdings from "@/src/components/Graphs/Holdings/Holdings";
import { setTheme } from "@/src/store/pagesSlice";
import TotalAddresses from "@/src/components/Graphs/TotalAddresses/TotalAddresses";
import { HandHeart } from "@phosphor-icons/react";
import DonationModal from "@/src/components/DonationModal/DonationModal";

type Props = {
  url: string;
};

export default function Home() {
  const router = useRouter();
  const [currTime, setCurrtime] = useState(
    Math.floor(new Date().getTime() / 1000)
  );
  const [graphType, setGraphType] = useState<"amount" | "day">("amount");
  const dispatch = useAppDispatch();
  const globalLoading = useAppSelector((state) => state.pages.globalLoading);
  const { sort, order, filter, age, balance, zeroOuts, dormant } = router.query;
  const [showDonation, setShowDonation] = useState(false);

  // set query parameters on redux
  useEffect(() => {
    dispatch(
      setAllQueriesURL({
        sortOrder: { sort, order },
        filter,
        age,
        balance,
        zeroOuts,
        dormant,
      })
    );
    dispatch(copyState());
  }, [router.query]);

  // set dark mode on load
  useEffect(() => {
    const theme = localStorage.getItem("AlphRichlistTheme") as
      | "white"
      | "dark"
      | null;
    if (!theme) localStorage.setItem("AlphRichlistTheme", "white");
    else {
      theme === "white"
        ? document.querySelector("html")!.classList.remove("dark")
        : document.querySelector("html")!.classList.add("dark");
      dispatch(setTheme(theme));
    }
  }, []);

  const onGraphType = (e: any) => {
    setGraphType(e.target.textContent.trim());
  };
  return (
    <>
      <Head>
        <title>Alph rich list</title>
        <meta name="description" content="Alephium rich list" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {showDonation && <DonationModal setShowDonation={setShowDonation} />}
      {!showDonation && (
        <button
          onClick={() => setShowDonation(true)}
          className={`fixed left-0 top-14 flex cursor-pointer flex-col items-center gap-1 rounded-r-md bg-rose-500 p-1 text-xs text-white dark:bg-yellow-600  xs:p-2 `}
        >
          <span>Donate</span>
          <HandHeart weight="fill" size={18} className="text-orange-100" />
        </button>
      )}
      <div className="flex justify-center text-sm md:text-base ">
        <div>
          Addresses per:{" "}
          <span
            onClick={onGraphType}
            className={`cursor-pointer ${
              graphType === "amount"
                ? " rounded-md  bg-slate-300 p-1 text-center transition-all hover:bg-gray-400 dark:bg-gray-900  dark:text-blue-100 dark:hover:bg-gray-800"
                : ""
            }`}
          >
            amount
          </span>{" "}
          |{" "}
          <span
            onClick={onGraphType}
            className={`cursor-pointer ${
              graphType === "day"
                ? "rounded-md  bg-slate-300 p-1 text-center transition-all hover:bg-gray-400 dark:bg-gray-900  dark:text-blue-100 dark:hover:bg-gray-800"
                : ""
            }`}
          >
            day
          </span>
        </div>
      </div>
      {!globalLoading && graphType === "amount" && <Holdings />}
      {!globalLoading && graphType === "day" && (
        <TotalAddresses currentTimestamp={currTime} />
      )}
      <Wallets pageNum={1}></Wallets>
    </>
  );
}
