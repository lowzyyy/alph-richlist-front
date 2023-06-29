import useSWR from "swr";

const seconds_in_day = 86_400;
export const usePriceHistory = (API: string) => {
  const { data, isLoading, error } = useSWR<{
    prices: { 0: number; 1: number }[];
  }>(`${API}/priceHistory`, (url) =>
    fetch(url, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    }).then((res) => res.json())
  );

  return { data, isLoading, error };
};
