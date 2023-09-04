import type { ChartOptions } from "chart.js";
import { AddressHoldings } from "./HoldingsTypes";
import { formatNumbers, getUsdBalanceString } from "@/src/globalHelpers";

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
            return toolTipItem.datasetIndex !== 2
              ? "Number of wallets: " + toolTipItem.formattedValue
              : "Alph in range: " + formatNumbers(toolTipItem.raw as number);
          },
          afterTitle: (toolTipItems) => {
            return toolTipItems[0].datasetIndex === 0 ||
              toolTipItems[0].datasetIndex === 2
              ? "w/ Genesis"
              : "w/o Genesis";
          },
        },
      },
    },
    scales: {
      y1: {
        type: "logarithmic",
        position: "left",
        ticks: {
          color: ticksColor,
        },
        grid: {
          color: gridColor,
        },
      },
      y2: {
        type: "logarithmic",
        position: "right",
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
  const perRangeColor = theme === "white" ? "#fb7185" : "#cc7e6c";
  const data = {
    labels,
    datasets: [
      {
        label: "Include Genesis*",
        data: Object.values(holdings[0] ?? []).map((el) => el.amount),
        backgroundColor: genesisColor,
        yAxisID: "y1",
      },
      {
        label: "Exclude Genesis*",
        data: Object.values(holdings[1] ?? []).map((el) => el.amount),
        backgroundColor: noGenesisColor,
        yAxisID: "y1",
        hidden: true,
      },
      {
        label: "Alph in range",
        data: Object.values(holdings[0] ?? []).map((el) => el.balance),
        backgroundColor: perRangeColor,
        yAxisID: "y2",
      },
    ],
  };
  return data;
};
