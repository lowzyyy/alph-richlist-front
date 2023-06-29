import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LogarithmicScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LogarithmicScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);
ChartJS.defaults.font.family = "__Roboto_0f2970";
import { Line } from "react-chartjs-2";
import { CircleDashed } from "@phosphor-icons/react";

import { useAppSelector } from "@/src/store/storeHooks";
// my imports
import GraphWrapper from "../GraphWrapper";
import { chartAreaBorder } from "./plugins/chartAreaBorder";
import { getMonthlyTotalAdd } from "./helpers";
import {
  setTotalAddressesGraphData,
  setTotalAddressesGraphOptions,
} from "./graphSettings";
// hooks
import { useTotalAddresses } from "./hooks/useTotalAddresses";
import { usePriceHistory } from "./hooks/usePriceHistory";

type Props = {
  API: string;
  currentTimestamp: number;
};
function TotalAddresses({ API, currentTimestamp }: Props) {
  const [showAxesLabel, setShowAxesLabel] = useState(true);
  const [shouldMaintainAspect, setShouldMaintainAspect] = useState(true);
  const [chartInterval, setChartInterval] = useState<"day" | "month">("day");
  const chartRef = useRef<ChartJS<"line", number[]>>(null);
  const currentPrice = useAppSelector((state) => state.pages.alphPrice);
  const theme = useAppSelector((state) => state.pages.theme);

  const { data: totalData, isLoading, error } = useTotalAddresses(API);
  const {
    data: alphPriceHistory,
    isLoading: isLoadingHistoryPrice,
    error: errorPriceHistory,
  } = usePriceHistory(API);

  // get monthly addresses aggregated by month
  const totalAddressesMonthly = useMemo(() => {
    return totalData ? getMonthlyTotalAdd(totalData) : [];
  }, [totalData]);

  let totalAddresses = totalData
    ? chartInterval === "day"
      ? totalData.slice(totalData.length - 365)
      : totalAddressesMonthly
    : [];

  // callbacks
  const onResizeChart = () => {
    // chartRef.current!.options.maintainAspectRatio =
    //   window.innerWidth < 450 ? false : true;
    // chartRef.current?.update();
  };
  const onChartInterval = (e: any) => {
    if (e.target.textContent === "month") {
      chartRef.current!.setDatasetVisibility(2, false);
      chartRef.current!.update();
    }
    setChartInterval(e.target.textContent);
  };
  // useEffect
  useEffect(() => {
    setShowAxesLabel(window.innerWidth < 450 ? false : true);
    setShouldMaintainAspect(window.innerWidth < 450 ? false : true);
    // initialize zoomPlugin
    const zoomInit = async () => {
      const zoomPlugin = (await import("chartjs-plugin-zoom")).default;
      ChartJS.register(zoomPlugin);
    };
    zoomInit();

    window.addEventListener("resize", onResizeChart);
    return document.removeEventListener("resize", onResizeChart);
  }, []);

  const options = setTotalAddressesGraphOptions(
    theme,
    shouldMaintainAspect,
    showAxesLabel,
    chartInterval
  );
  const data = setTotalAddressesGraphData(
    theme,
    totalAddresses,
    chartInterval,
    alphPriceHistory,
    currentPrice
  );

  if (error) return <p>Error loading wallet holdings graph</p>;
  if (errorPriceHistory) return <p>Error loading alph price history</p>;
  return (
    <GraphWrapper>
      <div className="mb-4 h-52 xs:h-auto xs:w-full">
        {isLoading || isLoadingHistoryPrice ? (
          <div className="flex h-full items-center md:h-[350px]">
            <CircleDashed className="mx-auto mb-4 animate-spin" size={30} weight="bold" />
          </div>
        ) : (
          <Line
            ref={chartRef}
            className=""
            data={data}
            options={options}
            plugins={[chartAreaBorder]}
          ></Line>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className=" text-sm md:text-base">
          Time interval:{" "}
          <span
            onClick={onChartInterval}
            className={`cursor-pointer ${
              chartInterval === "day"
                ? " rounded-md  bg-slate-300 p-1 text-center transition-all hover:bg-gray-400 dark:bg-gray-900  dark:text-blue-100 dark:hover:bg-gray-800"
                : ""
            }`}
          >
            day
          </span>{" "}
          |{" "}
          <span
            onClick={onChartInterval}
            className={`cursor-pointer ${
              chartInterval === "month"
                ? "rounded-md  bg-slate-300 p-1 text-center transition-all hover:bg-gray-400 dark:bg-gray-900  dark:text-blue-100 dark:hover:bg-gray-800"
                : ""
            }`}
          >
            month
          </span>
        </span>
        <button
          className="rounded-md bg-slate-300 p-1 transition-all hover:bg-gray-400 dark:bg-gray-900 dark:hover:bg-gray-800"
          onClick={() => chartRef.current?.resetZoom()}
        >
          Reset zoom
        </button>
      </div>
    </GraphWrapper>
  );
}

export default TotalAddresses;
