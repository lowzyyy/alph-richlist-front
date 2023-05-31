import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LogarithmicScale, BarElement, Title, Tooltip, Legend);
import { Bar } from "react-chartjs-2";

//my imports
import { setHoldingsGraphData, setHoldingsGraphOptions } from "./graphSettings";
import { useAppSelector } from "@/src/store/storeHooks";
import GraphWrapper from "../GraphWrapper";
import { useGetHoldings } from "./hooks/useGetHoldings";

type Props = {
  API: string;
};

function Holdings({ API }: Props) {
  const [shouldMaintainAspect, setShouldMaintainAspect] = useState(true);
  const theme = useAppSelector((state) => state.pages.theme);

  const { data: holdingsData, isLoading, error } = useGetHoldings(API);
  let holdings = holdingsData ? holdingsData : [null, null];

  const onResizeChart = () => {
    setShouldMaintainAspect(window.innerWidth < 450 ? false : true);
  };
  useEffect(() => {
    setShouldMaintainAspect(window.innerWidth < 450 ? false : true);
    window.addEventListener("resize", onResizeChart);
    return document.removeEventListener("resize", onResizeChart);
  }, []);

  const options = setHoldingsGraphOptions(theme, shouldMaintainAspect);
  const data = setHoldingsGraphData(theme, holdings);

  if (error) return <p>Error loading wallet holdings graph</p>;
  return (
    <GraphWrapper>
      <div className="mb-4 h-52 xs:h-auto xs:w-full">
        <Bar className="" data={data} options={options}></Bar>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 xs:text-sm">
        *include/exclude Genesis, Exchange, Pool addresses
      </p>
    </GraphWrapper>
  );
}

export default Holdings;
