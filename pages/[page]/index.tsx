import React from "react";

import { useRouter } from "next/router";
import Wallets from "@/src/components/Wallets/Wallets";
import Navigation from "@/src/components/Wallets/Navigation/Navigation";
import Head from "next/head";

function index() {
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
        <Wallets pageNum={+(page as string)}></Wallets>
        <Navigation pageNumber={+(page as string)}></Navigation>
      </div>
    </>
  );
}

export default index;
