export type AddressPerDate = {
  date: string;
  amount: number;
};

export type TotalAddressPerDate = AddressPerDate & { total: number };
