import WalletItem from "./WalletItem";
import { Wallet } from "./WalletTypes";
type Props = {
  wallets: Wallet[];
  alphPrice: number;
  pageNumber: number;
};
function WalletsList({ wallets, alphPrice, pageNumber }: Props) {
  return (
    <div className="rounded-md border border-black  ">
      {wallets.map((w, i) => {
        return (
          <WalletItem
            w={w}
            alphPrice={alphPrice}
            key={i}
            walletNumber={(pageNumber - 1) * 100 + (i + 1)}
          />
        );
      })}
    </div>
  );
}

export default WalletsList;
