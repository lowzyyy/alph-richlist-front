import useSWR from "swr";
import { AddressHoldings } from "../HoldingsTypes";

export const useGetHoldings = (API: string) => {
  const { data, isLoading, error } = useSWR<AddressHoldings[]>(`${API}/holdings`, (url) =>
    fetch(url, { headers: { "ngrok-skip-browser-warning": "true" } }).then((res) =>
      res.json()
    )
  );

  return { data, isLoading, error };
};
