import React from "react";

import { useRouter } from "next/router";
import Wallets from "@/src/components/Wallets/Wallets";
import Navigation from "@/src/components/Wallets/Navigation/Navigation";
import Head from "next/head";

type Props = {
  url: string;
};

function Page({ url }: Props) {
  const router = useRouter();
  const { page } = router.query;

  return (
    <>
      <Head>
        <title>Alph rich list {`page ${page}`}</title>
        <meta name="description" content="Alephium rich list" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Navigation pageNumber={+(page as string)}></Navigation>
        <Wallets pageNum={+(page as string)} STATS_API={url}></Wallets>
        <Navigation pageNumber={+(page as string)}></Navigation>
      </div>
    </>
  );
}

export default Page;

export async function getServerSideProps() {
  const ngrokRes = await fetch("https://api.ngrok.com/tunnels", {
    headers: {
      Authorization: "Bearer 2NYzCwy5GHXWL7KtnUAtThR6piv_DmfUbWeoe8SgxMF2eyqT",
      "ngrok-version": "2",
    },
  });
  if (!ngrokRes.ok) console.log(`ERROR NGROK API: ${ngrokRes.status}`);

  const { tunnels } = await ngrokRes.json();
  const url: string = tunnels[1].public_url;
  return {
    props: { url }, // will be passed to the page component as props
  };
}
