import React, { useEffect, useState } from "react";
import useSWR from "swr";
import {
  Chart as ChartJS,
  CategoryScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
ChartJS.register(CategoryScale, LogarithmicScale, BarElement, Title, Tooltip, Legend);
import { Bar } from "react-chartjs-2";

//my imports
import { AddressHoldings } from "./HoldingsTypes";
import { labels } from "./graphSettings";
import { useAppSelector } from "@/src/store/storeHooks";
import GraphWrapper from "../GraphWrapper";

type Props = {
  API: string;
};

function Holdings({ API }: Props) {
  const [shouldMaintainAspect, setShouldMaintainAspect] = useState(true);
  const theme = useAppSelector((state) => state.pages.theme);
  const {
    data: holdingsData,
    isLoading,
    error,
  } = useSWR<AddressHoldings[]>(`${API}/holdings`, (url) =>
    fetch(url, { headers: { "ngrok-skip-browser-warning": "true" } }).then((res) =>
      res.json()
    )
  );
  let holdings = holdingsData ? holdingsData : [null, null];

  const ticksColor = theme === "white" ? "#334155" : "#d1d5db";
  const gridColor = theme === "white" ? "#d1d5db" : "#404040";
  const genesisColor = theme === "white" ? "#a5b4fc" : "#6366f1";
  const noGenesisColor = theme === "white" ? "#60a5fa" : "#3b82f6";

  const onResizeChart = () => {
    setShouldMaintainAspect(window.innerWidth < 450 ? false : true);
  };
  useEffect(() => {
    setShouldMaintainAspect(window.innerWidth < 450 ? false : true);
    window.addEventListener("resize", onResizeChart);
    return document.removeEventListener("resize", onResizeChart);
  }, []);

  const options: ChartOptions<"bar"> = {
    maintainAspectRatio: shouldMaintainAspect,
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: ticksColor,
        },
      },
      tooltip: {
        callbacks: {
          label: (toolTipItem) => {
            return "Number of wallets: " + toolTipItem.formattedValue;
          },
          afterTitle: (toolTipItems) => {
            return toolTipItems[0].datasetIndex === 0 ? "w/ Genesis" : "w/o Genesis";
          },
        },
      },
    },
    scales: {
      y: {
        type: "logarithmic",
        ticks: {
          color: ticksColor,
        },
        grid: {
          color: gridColor,
        },
      },
      x: {
        ticks: {
          color: ticksColor,
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Include Genesis*",
        data: Object.values(holdings[0] ?? []),
        backgroundColor: genesisColor,
      },
      {
        label: "Exclude Genesis*",
        data: Object.values(holdings[1] ?? []),
        backgroundColor: noGenesisColor,
      },
    ],
  };
  if (error) return <p>Error loading wallet holdings graph</p>;
  return (
    <GraphWrapper>
      {/* <p className="mb-1 text-center text-xs font-medium text-gray-600 dark:text-inherit xs:text-sm lg:text-base lg:font-medium">
        Number of wallets per amount
      </p> */}
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
