import type { ChartOptions, ChartData } from "chart.js";

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

const ticksColor = "#334155";
export const options: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
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
    },
    x: {
      ticks: {
        color: ticksColor,
      },
    },
  },
};
