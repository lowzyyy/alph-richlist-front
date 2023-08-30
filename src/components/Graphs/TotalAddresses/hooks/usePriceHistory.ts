import useSWR from "swr";
import { Prices } from "../TotalAddressesTypes";

const seconds_in_day = 86_400;
export const usePriceHistory = () => {
  const { data, isLoading, error } = useSWR<Prices>(
    `/api/priceHistory`,
    (url) =>
      fetch(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }).then((res) => res.json())
  );

  return { data, isLoading, error };
};
