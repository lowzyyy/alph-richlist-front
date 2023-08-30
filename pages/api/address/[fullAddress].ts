import { AddressResult } from "@/src/components/SearchAddress/SearchAddressTypes";
import { getAPI } from "@/src/globalHelpers";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AddressResult | undefined>
) {
  try {
    const API = await getAPI();
    const address = req.query.fullAddress;
    const response = await fetch(`${API}/address/${address}`);
    if (!response.status) throw Error(`ERROR ADDRESS: ${response.status}`);

    const result = await response.json();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json(undefined);
  }
}
