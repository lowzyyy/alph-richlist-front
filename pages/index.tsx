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

export default function Home(props: { wallets: Wallet[] }) {
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
      <Wallets pageNum={1}></Wallets>
      <Navigation pageNumber={1}></Navigation>
    </>
  );
}

// export async function getStaticProps(context: any) {
//   const resWall = await fetch("https://alephium.ono.re/api/stats/tx-history");
//   const wallets = await resWall.json();
//   return {
//     props: { wallets: wallets.slice(0, 100) },
//   };
// }
