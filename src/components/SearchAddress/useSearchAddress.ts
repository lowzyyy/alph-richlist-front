import useSWR from "swr";
import { AddressResult } from "./SearchAddressTypes";

export const useSearchAddress = (address: string) => {
  const { data, isLoading, error } = useSWR<AddressResult>(
    !!!address ? null : address,
    (key: [null | string, null | string]) =>
      fetch(`/api/address/${key}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }).then((res) => res.json())
  );

  return { data, isLoading, error };
};
