export type Wallet = {
  address: string;
  created_on: string;
  updated_on: string;
  first_tx_recv: string;
  last_tx_recv: string;
  first_tx_send: string | null;
  last_tx_send: string | null;
  balance: number;
  balanceHint: string;
  name: string | null;
  type: string | null;
  // insNumber: string; //--->THIS WOULD BE COOL :D
  // outsNumber: string; //
};

export type Addresses = {
  active_addresess: number;
  addresses: Wallet[];
  last_update: string;
  total_balance: string;
  total_locked: string;
};
