import React from "react";
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

type Props = {
  HOLDINGS_API: string;
};

function Holdings({ HOLDINGS_API }: Props) {
  const theme = useAppSelector((state) => state.pages.theme);
  const {
    data: holdingsData,
    isLoading,
    error,
  } = useSWR<AddressHoldings[]>(`${HOLDINGS_API}/holdings`, (url) =>
    fetch(url, { headers: { "ngrok-skip-browser-warning": "true" } }).then((res) =>
      res.json()
    )
  );
  let holdings = holdingsData ? holdingsData : [null, null];

  const ticksColor = theme === "white" ? "#334155" : "#d1d5db";
  const gridColor = theme === "white" ? "#d1d5db" : "#262626";
  const options: ChartOptions<"bar"> = {
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
        backgroundColor: "#a5b4fc",
      },
      {
        label: "Exclude Genesis*",
        data: Object.values(holdings[1] ?? []),
        backgroundColor: "#60a5fa",
      },
    ],
  };
  if (error) return <p>Error loading wallet holdings graph</p>;
  return (
    <div className="mx-auto mb-6 md:w-[80%] xl:w-[60%]">
      <p className="mb-1 text-center text-xs font-medium text-gray-600 dark:text-inherit xs:text-sm lg:text-base lg:font-medium">
        Number of wallets per amount
      </p>
      <Bar className="mb-4" data={data} options={options}></Bar>
      <p className="text-xs text-gray-500 dark:text-gray-400 xs:text-sm">
        *include/exclude Genesis, Exchange, Pool addresses
      </p>
    </div>
  );
}

export default Holdings;
