import useSWR from "swr";

const seconds_in_day = 86_400;
export const usePriceHistory = (nowSeconds: number) => {
  // const nowSeconds = Math.floor(new Date().getTime() / 1000);
  const { data, isLoading, error } = useSWR<{
    prices: { 0: number; 1: number }[];
  }>(
    `https://api.coingecko.com/api/v3/coins/alephium/market_chart/range?vs_currency=usd&from=${
      nowSeconds - 364 * seconds_in_day
    }&to=${nowSeconds}`,
    (url) =>
      fetch(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }).then((res) => res.json())
  );

  return { data, isLoading, error };
};
