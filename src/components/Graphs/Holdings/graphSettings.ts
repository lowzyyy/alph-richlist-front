import type { ChartOptions } from "chart.js";
import { AddressHoldings } from "./HoldingsTypes";

export const labels = [
  "1-1000",
  "1k-10k",
  "10-100k",
  "100-500k",
  "500k-1M",
  "1-5M",
  "5-10M",
  "10M+",
];

export const setHoldingsGraphOptions = (
  theme: "white" | "dark",
  shouldMaintainAspect: boolean
) => {
  const ticksColor = theme === "white" ? "#334155" : "#d1d5db";
  const gridColor = theme === "white" ? "#d1d5db" : "#404040";

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
  return options;
};

export const setHoldingsGraphData = (
  theme: "white" | "dark",
  holdings: AddressHoldings[] | null[]
) => {
  const genesisColor = theme === "white" ? "#a5b4fc" : "#6366f1";
  const noGenesisColor = theme === "white" ? "#60a5fa" : "#3b82f6";
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
  return data;
};
