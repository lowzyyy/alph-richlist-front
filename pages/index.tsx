import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
// store
import { useAppDispatch, useAppSelector } from "@/src/store/storeHooks";
import { setAllQueriesURL } from "@/src/store/urlQueriesSlice";
import { copyState } from "@/src/store/urlQueriesCopy";

// components
import Wallets from "../src/components/Wallets/Wallets";
import Holdings from "@/src/components/Holdings/Holdings";

type Props = {
  url: string;
};

// TODO:
// make filter modal prettier
export default function Home({ url }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const globalLoading = useAppSelector((state) => state.pages.globalLoading);
  const { sort, order, filter, age, balance, zeroOuts, dormant } = router.query;
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

  return (
    <>
      <Head>
        <title>Alph rich list</title>
        <meta name="description" content="Alephium rich list" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!globalLoading && <Holdings HOLDINGS_API={url} />}
      <Wallets pageNum={1} STATS_API={url}></Wallets>
    </>
  );
}

export async function getServerSideProps() {
  const ngrokRes = await fetch("https://api.ngrok.com/tunnels", {
    headers: {
      Authorization: "Bearer 2NYzCwy5GHXWL7KtnUAtThR6piv_DmfUbWeoe8SgxMF2eyqT",
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
