import { AddressHoldings } from "@/src/components/Graphs/Holdings/HoldingsTypes";
import { getAPI } from "@/src/globalHelpers";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AddressHoldings[] | undefined>
) {
  try {
    const API = await getAPI();
    const response = await fetch(`${API}/holdings`);
    if (!response.status) throw Error(`ERROR HOLDINGS: ${response.status}`);

    const result = await response.json();
    res.status(200).json(result);
  } catch (error: any) {
    console.log(error);
    res.status(400).json(undefined);
  }
}
