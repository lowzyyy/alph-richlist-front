import { donation_address } from "@/src/globalHelpers";
import { HandHeart } from "@phosphor-icons/react";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  setShowDonation: Dispatch<SetStateAction<boolean>>;
};

function DonationModal({ setShowDonation }: Props) {
  return (
    <div
      onClick={() => setShowDonation(false)}
      className="fixed left-0 top-0 flex h-full w-full justify-center  bg-slate-700 bg-opacity-60 backdrop-blur-[2px] dark:bg-gray-900 dark:bg-opacity-60"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-40 w-[96%] rounded-md border border-slate-700 bg-slate-300 p-2 py-4 text-slate-950 dark:border-slate-600  dark:bg-slate-900 dark:text-stone-200 sm:w-[500px] md:px-4 md:py-6"
      >
        <p className="text-center text-sm sm:text-base">
          This project is community driven so donations keep it running (and ad
          free)
        </p>
        <p className="mt-4 flex justify-center gap-4 text-center">
          <HandHeart
            weight="fill"
            size={18}
            className="text-indigo-600 dark:text-orange-400"
          />
          Donation address
          <HandHeart
            weight="fill"
            size={18}
            className="text-indigo-600 dark:text-orange-400"
          />
        </p>
        <p className="mt-4 text-center text-xs font-bold text-rose-600 dark:text-amber-500 xs:text-sm md:text-base">
          {donation_address}
        </p>
        <p className="mt-4 text-center">Thank you.</p>
      </div>
    </div>
  );
}

export default DonationModal;
