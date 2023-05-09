import { useAppSelector } from "@/src/store/storeHooks";
import useSWR from "swr";
import { Wallet } from "../Wallets/WalletTypes";

export const useSearchAddress = (address: string) => {
  const api = useAppSelector((state) => state.pages.API_STATS);

  const { data, isLoading, error } = useSWR<{
    index: number | null;
    indexNoGen: number | null;
    walletInfo: Wallet;
  }>(
    !!!api || !!!address ? null : [api, address],
    ([url, key]: [null | string, null | string]) =>
      fetch(url + `/address/${key}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }).then((res) => res.json())
  );

  return { data, isLoading, error };
};
