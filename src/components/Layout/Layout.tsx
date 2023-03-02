import { Roboto } from "next/font/google";
import React, { Children, ReactNode } from "react";
import alphLogo from "../../../public/alph_logo.png";
const rob = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
});
function Layout(props: { children: ReactNode }) {
  return (
    <div className={`${rob.variable}`}>
      <header className="mb-4 flex h-14 w-full items-center bg-slate-200  font-roboto">
        <div className="mx-auto  flex h-full w-[95%] items-center p-2 text-2xl font-semibold xl:max-w-[80%] 2xl:w-[70%]">
          <img src={alphLogo.src} className="max-h-full"></img>
          <span className="">Alephium rich list</span>
        </div>
      </header>
      <main className={`mx-auto max-w-[95%] font-roboto xl:max-w-[80%] 2xl:max-w-[70%]`}>
        {props.children}
      </main>
    </div>
  );
}

export default Layout;
