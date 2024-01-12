import useSWR from "swr";
import { Addresses } from "../WalletTypes";

export const useGetAddresses = (pageNum: number, combinedCopyQuery: string) => {
  const { data, isLoading, error } = useSWR<Addresses>(
    `/api/addresses?page=${pageNum}${combinedCopyQuery}`,
    (url) => fetch(url, {}).then((res) => res.json())
  );

  return { data, isLoading, error };
};
