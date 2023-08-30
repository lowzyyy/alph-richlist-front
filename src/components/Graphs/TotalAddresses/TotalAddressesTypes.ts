export type AddressPerDate = {
  date: string;
  amount: number;
};

export type TotalAddressPerDate = AddressPerDate & { total: number };

export type Prices = {
  prices: { 0: number; 1: number }[];
};
