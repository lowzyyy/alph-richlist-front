import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
// store
import { useAppDispatch } from "@/src/store/storeHooks";
import { setAllQueriesURL } from "@/src/store/urlQueriesSlice";
// components
import Wallets from "@/src/components/Wallets/Wallets";
import { copyState } from "@/src/store/urlQueriesCopySlice";
import { setTheme } from "@/src/store/pagesSlice";

type Props = {
  url: string;
};

function Page() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { page, sort, order, filter, age, balance, zeroOuts, dormant } =
    router.query;
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

  const title = `Alph rich list page ${page}`;
  const pageNumber = +(page as string);
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Alephium rich list" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Wallets pageNum={pageNumber}></Wallets>
      </div>
    </>
  );
}

export default Page;
