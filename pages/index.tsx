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
import { setApi, setTheme } from "@/src/store/pagesSlice";
import TotalAddresses from "@/src/components/Graphs/TotalAddresses/TotalAddresses";

type Props = {
  url: string;
};

export default function Home({ url }: Props) {
  const router = useRouter();
  const [currTime, setCurrtime] = useState(Math.floor(1656609569 / 1000));
  const [graphType, setGraphType] = useState<"amount" | "day">("amount");
  const dispatch = useAppDispatch();
  const globalLoading = useAppSelector((state) => state.pages.globalLoading);
  const { sort, order, filter, age, balance, zeroOuts, dormant } = router.query;
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
    const theme = localStorage.getItem("AlphRichlistTheme") as "white" | "dark" | null;
    if (!theme) localStorage.setItem("AlphRichlistTheme", "white");
    else {
      theme === "white"
        ? document.querySelector("html")!.classList.remove("dark")
        : document.querySelector("html")!.classList.add("dark");
      dispatch(setTheme(theme));
    }
    dispatch(setApi(url));
    setCurrtime(Math.floor(new Date().getTime() / 1000));
  }, []);
  useEffect(() => {
    dispatch(setApi(url));
  }, [url]);

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
      {!globalLoading && graphType === "amount" && <Holdings API={url} />}
      {!globalLoading && graphType === "day" && (
        <TotalAddresses currentTimestamp={currTime} API={url} />
      )}
      <Wallets pageNum={1} STATS_API={url}></Wallets>
    </>
  );
}

export async function getServerSideProps() {
  const ngrokRes = await fetch("https://api.ngrok.com/tunnels", {
    headers: {
      Authorization: `Bearer ${process.env.ngrok_api_key}`,
      "ngrok-version": "2",
    },
  });
  if (!ngrokRes.ok) console.log(`ERROR NGROK API: ${ngrokRes.status}`);

  const { tunnels } = await ngrokRes.json();

  const url: string = tunnels.find((t: any) =>
    t.public_url.startsWith("https")
  ).public_url;

  return {
    props: { url }, // will be passed to the page component as props
  };
}
