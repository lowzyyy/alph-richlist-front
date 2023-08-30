import { Wallet } from "../Wallets/WalletTypes";

export type AddressResult = {
  index: number | null;
  indexNoGen: number | null;
  walletInfo: Wallet;
};
