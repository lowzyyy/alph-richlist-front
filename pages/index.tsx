import Head from "next/head";
import { Inter } from "next/font/google";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// components
import Wallets from "../src/components/Wallets/Wallets";
//types
import { Wallet } from "@/src/components/Wallets/WalletTypes";
import Navigation from "@/src/components/Wallets/Navigation/Navigation";
import Holdings from "@/src/components/Holdings/Holdings";

type Props = {
  url: string;
};

export default function Home({ url }: Props) {
  return (
    <>
      <Head>
        <title>Alph rich list</title>
        <meta name="description" content="Alephium rich list" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Holdings />
      <Navigation pageNumber={1}></Navigation>
      <Wallets pageNum={1} STATS_API={url}></Wallets>
      <Navigation pageNumber={1}></Navigation>
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
  const url: string = tunnels[1].public_url;
  return {
    props: { url }, // will be passed to the page component as props
  };
}
