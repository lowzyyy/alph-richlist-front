import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
// store
import { useAppDispatch } from "@/src/store/storeHooks";
import { setAllQueriesURL } from "@/src/store/urlQueriesSlice";
// components
import Wallets from "@/src/components/Wallets/Wallets";
import { copyState } from "@/src/store/urlQueriesCopy";
import { setTheme } from "@/src/store/pagesSlice";

type Props = {
  url: string;
};

function Page({ url }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { page, sort, order, filter, age, balance, zeroOuts, dormant } = router.query;
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
        <Wallets pageNum={pageNumber} STATS_API={url}></Wallets>
      </div>
    </>
  );
}

export default Page;

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
