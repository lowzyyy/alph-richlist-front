import { Prices } from "@/src/components/Graphs/TotalAddresses/TotalAddressesTypes";
import { getAPI } from "@/src/globalHelpers";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Prices | undefined>
) {
  try {
    const API = await getAPI();
    const response = await fetch(`${API}/priceHistory`);
    if (!response.status)
      throw Error(`ERROR PRICE HISTORY: ${response.status}`);

    const result = await response.json();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json(undefined);
  }
}
