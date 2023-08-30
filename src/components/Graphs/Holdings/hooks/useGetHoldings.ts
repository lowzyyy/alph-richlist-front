import useSWR from "swr";
import { AddressHoldings } from "../HoldingsTypes";

export const useGetHoldings = () => {
  const { data, isLoading, error } = useSWR<AddressHoldings[]>(
    `/api/holdings`,
    (url) =>
      fetch(url, { headers: { "ngrok-skip-browser-warning": "true" } }).then(
        (res) => res.json()
      )
  );

  return { data, isLoading, error };
};
