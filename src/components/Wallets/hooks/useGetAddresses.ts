import useSWR from "swr";
import { Addresses } from "../WalletTypes";

export const useGetAddresses = (
  STATS_API: string,
  pageNum: number,
  combinedCopyQuery: string
) => {
  const { data, isLoading, error } = useSWR<Addresses>(
    `${STATS_API}/addresses?page=${pageNum}${combinedCopyQuery}`,
    (url) =>
      fetch(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }).then((res) => res.json())
  );

  return { data, isLoading, error };
};
