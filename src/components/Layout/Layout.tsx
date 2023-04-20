import React, { ReactNode } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Roboto } from "next/font/google";
import alphLogo from "../../../public/alph_logo.png";
import { GithubLogo } from "@phosphor-icons/react";
// components
import FilterModal from "../FilterModal/FilterModal";
// store
import { useAppSelector } from "@/src/store/storeHooks";
import { relative } from "path";
const rob = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
});
const donationAddress = "12J8rmA29dRs9bEk266KABj5ybP3kqxG9me5hzUKgkGk5";
function Layout(props: { children: ReactNode }) {
  const showFilter = useAppSelector((state) => state.filterModal.showFilter);
  const router = useRouter();
  return (
    <div className={`${rob.variable} flex min-h-screen flex-col justify-between`}>
      <div>
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
          className={`relative mx-auto  max-w-[95%] font-roboto xl:max-w-[80%] 2xl:max-w-[70%]`}
        >
          {showFilter && <FilterModal />}

          {props.children}
        </main>
      </div>
      <footer className=" w-full  bg-slate-200 text-sm font-semibold xs:text-sm  sm:text-base">
        <div className="mx-auto flex w-[95%] flex-col gap-1 p-2 pb-4 xs:gap-2 xl:max-w-[80%] 2xl:w-[70%]">
          <span className="flex items-center justify-between">
            Feel free to donate :)
            {
              <span className="flex items-center gap-1">
                Made by{" "}
                <Link
                  href={"https://github.com/lowzyyy"}
                  className="cursor-pointer rounded-lg bg-slate-300 p-1"
                >
                  <GithubLogo size={20} weight="fill" className="text-indigo-500" />
                </Link>
              </span>
            }
          </span>
          <span className="break-words text-xs xs:text-sm sm:text-base">
            ALPH address: <br className="sm:hidden"></br>
            {`${donationAddress}`}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
