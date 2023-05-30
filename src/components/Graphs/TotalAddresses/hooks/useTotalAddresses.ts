import useSWR from "swr";
import { TotalAddressPerDate } from "../TotalAddressesTypes";

export const useTotalAddresses = (API: string) => {
  const { data, isLoading, error } = useSWR<TotalAddressPerDate[]>(
    `${API}/totalAddresses`,
    (url) =>
      fetch(url, { headers: { "ngrok-skip-browser-warning": "true" } }).then((res) =>
        res.json()
      )
  );

  return { data, isLoading, error };
};
