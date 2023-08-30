import useSWR from "swr";
import { TotalAddressPerDate } from "../TotalAddressesTypes";

export const useTotalAddresses = () => {
  const { data, isLoading, error } = useSWR<TotalAddressPerDate[]>(
    `/api/totalAddresses`,
    (url) =>
      fetch(url, { headers: { "ngrok-skip-browser-warning": "true" } }).then(
        (res) => res.json()
      )
  );

  return { data, isLoading, error };
};
