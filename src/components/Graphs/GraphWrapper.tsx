import React, { ReactNode } from "react";

function GraphWrapper({ children }: { children: ReactNode }) {
  return <div className="mx-auto mb-6 md:w-[80%] xl:w-[55%]">{children}</div>;
}

export default GraphWrapper;
