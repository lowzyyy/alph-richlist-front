export type Wallet = {
  address: string;
  updated_on: string;
  first_tx_recv: number;
  last_tx_recv: number;
  first_tx_send: number | null;
  last_tx_send: number | null;
  balance: number;
  balanceHint: string;
  locked_balance: number;
  lockedHint: string;
  name: string | null;
  type: string | null;
  ins: number;
  outs: number;
  isGenesis: boolean;
  isReserved: boolean;
};

export type Addresses = {
  active_addresses: number;
  addresses: Wallet[];
  last_update: string;
  // total_balance: string;
  // total_locked: string;
};

export type queryParam = string | string[] | undefined;

export type indexedWallet = (Wallet & { index: number }) | null;
