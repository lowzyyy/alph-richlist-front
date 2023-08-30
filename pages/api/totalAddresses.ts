import { AddressHoldings } from "@/src/components/Graphs/Holdings/HoldingsTypes";
import { TotalAddressPerDate } from "@/src/components/Graphs/TotalAddresses/TotalAddressesTypes";
import { getAPI } from "@/src/globalHelpers";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TotalAddressPerDate[] | undefined>
) {
  try {
    const API = await getAPI();
    const response = await fetch(`${API}/totalAddresses`);
    if (!response.status)
      throw Error(`ERROR TOTAL ADDRESSES: ${response.status}`);

    const result = await response.json();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json(undefined);
  }
}
