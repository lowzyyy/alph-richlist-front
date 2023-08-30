import { Addresses } from "@/src/components/Wallets/WalletTypes";
import { getAPI } from "@/src/globalHelpers";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Addresses | undefined>
) {
  try {
    let q = Object.keys(req.query)
      .reduce((acc, curr) => acc + `${curr}=${req.query[curr]}&`, "")
      .slice(0, -1);

    const API = await getAPI();
    const response = await fetch(`${API}/addresses?${q}`);
    if (!response.status) throw Error(`ERROR ADDRESSES: ${response.status}`);

    const result = await response.json();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json(undefined);
  }
}
