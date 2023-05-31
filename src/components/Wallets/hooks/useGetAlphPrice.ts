import useSWR from "swr";
export const useGetAlphPrice = () => {
  const { data, isLoading } = useSWR<number>(
    "https://api.coingecko.com/api/v3/coins/alephium",
    (url) =>
      fetch(url).then(async (res) => {
        const info = await res.json();
        return info.market_data.current_price.usd;
      }),
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Never retry on 404/403
        if (error.status === 404) return;
        if (error.status === 403) return;
        // Only retry up to 3 times.
        if (retryCount >= 3) return;
        // Retry after 5 seconds.
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    }
  );

  return { data, isLoading };
};
