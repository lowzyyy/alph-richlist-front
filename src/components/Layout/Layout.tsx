import { Roboto } from "next/font/google";
import React, { ReactNode } from "react";
import alphLogo from "../../../public/alph_logo.png";
import { useAppSelector } from "@/src/store/storeHooks";
import FilterModal from "../FilterModal/FilterModal";
import Link from "next/link";
import { useRouter } from "next/router";
const rob = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
});
function Layout(props: { children: ReactNode }) {
  const showFilter = useAppSelector((state) => state.filterModal.showFilter);
  const router = useRouter();
  return (
    <div className={`${rob.variable}`}>
      <header className="mb-4 flex h-14 w-full items-center bg-slate-200  font-roboto">
        <div className="mx-auto  flex h-full w-[95%] items-center p-2 text-2xl font-semibold xl:max-w-[80%] 2xl:w-[70%]">
          <img
            onClick={() => router.push("/")}
            src={alphLogo.src}
            alt="Alephium logo"
            className="max-h-full cursor-pointer"
          ></img>
          <span className="">
            <Link href="/">Alephium rich list</Link>
          </span>
        </div>
      </header>
      <main
        className={`relative mx-auto max-w-[95%]  font-roboto xl:max-w-[80%] 2xl:max-w-[70%]`}
      >
        {showFilter && <FilterModal />}

        {props.children}
      </main>
    </div>
  );
}

export default Layout;
