import { ChartOptions } from "chart.js";
import { TotalAddressPerDate } from "./TotalAddressesTypes";

const axesLabelFontSize = 13;

export const setGraphOptions = (
  theme: "white" | "dark",
  shouldMaintainAspect: boolean,
  showAxesLabel: boolean,
  chartInterval: "day" | "month"
) => {
  const ticksColor = theme === "white" ? "#334155" : "#d1d5db";
  const gridColor = theme === "white" ? "#d1d5db" : "#404040";

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: shouldMaintainAspect,
    animation: { duration: 500 },
    interaction: {
      intersect: false,
      mode: "nearest",
      axis: "x",
    },
    onHover: (event) => {
      const legend = event.native?.target as HTMLCanvasElement;
      legend.style.cursor = "default";
    },
    plugins: {
      zoom: {
        limits: {
          x: { minRange: chartInterval === "day" ? 10 : 3 },
        },
        zoom: {
          mode: "x",
          drag: { enabled: true },
        },
      },

      chartAreaBorder: {
        borderColor: gridColor,
        borderWidth: 1,
      },
      legend: {
        onHover: (event) => {
          const legend = event.native?.target as HTMLCanvasElement;
          legend!.style.cursor = "pointer";
        },
        labels: {
          color: ticksColor,
          filter: (legend) =>
            chartInterval === "month" ? legend.text !== "Alph price" : true,
        },
      },
      tooltip: {
        callbacks: {
          label: (toolTipItem) => {
            if (toolTipItem.datasetIndex === 0)
              return (
                `${chartInterval === "day" ? "Per day: " : "Per month: "}` +
                toolTipItem.formattedValue
              );
            if (toolTipItem.datasetIndex === 1)
              return "Total: " + toolTipItem.formattedValue;
            if (toolTipItem.datasetIndex === 2)
              return "Alph price: " + toolTipItem.formattedValue;
          },
        },
      },
    },
    scales: {
      y1: {
        position: "left",
        type: "logarithmic",
        ticks: {
          color: ticksColor,
        },
        grid: {
          color: gridColor,
          display: true,
        },
        title: {
          display: showAxesLabel,
          color: ticksColor,
          text: "Per day",
          font: { size: axesLabelFontSize },
        },
      },
      y2: {
        display: "auto",
        position: "right",
        ticks: {
          color: ticksColor,
        },
        grid: {
          color: gridColor,
          display: true,
        },
        title: {
          display: showAxesLabel,
          color: ticksColor,
          text: "Total",
          font: { size: axesLabelFontSize },
        },
      },

      y3: {
        display: false,
      },
      x: {
        ticks: {
          maxRotation: 0,
          color: ticksColor,
          callback: function (value) {
            const stringValue = this.getLabelForValue(value as number);
            const splitDate = stringValue.split("/");

            return chartInterval === "day"
              ? stringValue
                ? stringValue.split("/")[1] === "15"
                  ? splitDate.slice(0, 2).join("/")
                  : null
                : undefined
              : splitDate[0] + "/" + splitDate[1].slice(2);
          },
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };
  return options;
};

export const setGraphData = (
  theme: "white" | "dark",
  totalAddresses: TotalAddressPerDate[] | undefined,
  alphPriceHistory: { prices: { 0: number; 1: number }[] } | undefined,
  currentPrice: number | null
) => {
  const perDateColor = theme === "white" ? "#4f46e5" : "#f9a8d4";
  const totalColor = theme === "white" ? "#60a5fa" : "#16a34a";
  const priceColor = theme === "white" ? "#ca8a04" : "#fef3c7";

  const data = {
    labels: totalAddresses ? totalAddresses.map((el) => el?.date) : [],
    datasets: [
      {
        label: "Per day",
        data: totalAddresses ? totalAddresses.map((el) => el?.amount) : [],
        backgroundColor: perDateColor,
        borderColor: perDateColor,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 1,
        transitions: {
          show: {
            animations: {
              y: {
                from: -1000,
              },
              x: {
                from: 0,
              },
            },
          },
          hide: {
            animations: {
              y: {
                to: 0,
              },
              x: {
                to: 0,
              },
            },
          },
        },
        yAxisID: "y1",
        hidden: true,
      },
      {
        label: "Total",
        data: totalAddresses ? totalAddresses.map((el) => el?.total) : [],
        backgroundColor: totalColor,
        borderColor: totalColor,
        pointRadius: 0,
        pointHoverRadius: 6,
        transitions: {
          show: {
            animations: {
              y: {
                from: 1000,
              },
              x: {
                from: 0,
              },
            },
          },
          hide: {
            animations: {
              y: {
                to: 0,
              },
              x: {
                to: 0,
              },
            },
          },
        },
        yAxisID: "y2",
      },
      {
        label: "Alph price",
        data: alphPriceHistory
          ? currentPrice
            ? [...alphPriceHistory.prices.map((p) => p[1]), currentPrice]
            : alphPriceHistory.prices.map((p) => p[1])
          : [],
        backgroundColor: priceColor,
        borderColor: priceColor,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 1,
        yAxisID: "y3",
        hidden: true,
      },
    ],
  };
  return data;
};
