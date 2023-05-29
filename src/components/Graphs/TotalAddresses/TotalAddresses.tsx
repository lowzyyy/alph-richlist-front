import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import {
  Chart as ChartJS,
  CategoryScale,
  LogarithmicScale,
  LineController,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Chart,
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

//my imports
// import { AddressHoldings } from "./HoldingsTypes";
// import { labels } from "./graphSettings";
import { useAppSelector } from "@/src/store/storeHooks";
import { TotalAddressPerDate } from "./TotalAddressesTypes";
import GraphWrapper from "../GraphWrapper";
import { chartAreaBorder } from "./chartAreaBorder";
import { usePriceHistory } from "./usePriceHistory";

type Props = {
  API: string;
  currentTimestamp: number;
};
//TODO: make monthly graph
function TotalAddresses({ API, currentTimestamp }: Props) {
  const [shouldMaintainAspect, setShouldMaintainAspect] = useState(true);
  const [showAxesLabel, setShowAxesLabel] = useState(true);
  const [chartInterval, setChartInterval] = useState<"day" | "month">("day");
  const chartRef = useRef<ChartJS<"line", number[]>>(null);
  const currentPrice = useAppSelector((state) => state.pages.alphPrice);
  const theme = useAppSelector((state) => state.pages.theme);
  const {
    data: totalData,
    isLoading,
    error,
  } = useSWR<TotalAddressPerDate[]>(`${API}/totalAddresses`, (url) =>
    fetch(url, { headers: { "ngrok-skip-browser-warning": "true" } }).then((res) =>
      res.json()
    )
  );
  const {
    data: alphPriceHistory,
    isLoading: isLoadingHistoryPrice,
    error: errorPriceHistory,
  } = usePriceHistory(currentTimestamp);

  let totalAddresses = totalData ? totalData : [null, null];

  const ticksColor = theme === "white" ? "#334155" : "#d1d5db";
  const gridColor = theme === "white" ? "#d1d5db" : "#404040";

  const perDateColor = theme === "white" ? "#4f46e5" : "#fde047";
  const totalColor = theme === "white" ? "#60a5fa" : "#16a34a";
  const priceColor = theme === "white" ? "#ca8a04" : "#fef3c7";

  // callbacks
  const onResizeChart = () => {
    setShouldMaintainAspect(window.innerWidth < 450 ? false : true);
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
    setShouldMaintainAspect(window.innerWidth < 450 ? false : true);
    setShowAxesLabel(window.innerWidth < 450 ? false : true);

    // initialize zoomPlugin
    const zoomInit = async () => {
      const zoomPlugin = (await import("chartjs-plugin-zoom")).default;
      ChartJS.register(zoomPlugin);
    };
    zoomInit();

    window.addEventListener("resize", onResizeChart);
    return document.removeEventListener("resize", onResizeChart);
  }, []);

  const axesLabelFontSize = 13;

  const options: ChartOptions<"line"> = {
    maintainAspectRatio: shouldMaintainAspect,
    responsive: true,
    animation: { duration: 500 },
    interaction: {
      intersect: false,
      mode: "nearest",
      axis: "x",
    },
    plugins: {
      zoom: {
        zoom: {
          mode: "x",
          drag: { enabled: true, threshold: 5 },
        },
      },

      chartAreaBorder: {
        borderColor: gridColor,
        borderWidth: 1,
      },
      legend: {
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
              return "Per day: " + toolTipItem.formattedValue;
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
            return stringValue
              ? stringValue.split("/")[1] === "15"
                ? stringValue.split("/").slice(0, 2).join("/")
                : null
              : undefined;
          },
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };

  const data = {
    labels: totalAddresses
      ? totalAddresses.slice(totalAddresses.length - 365).map((el) => el?.date)
      : [],
    datasets: [
      {
        label: "Per day",
        data: totalAddresses
          ? totalAddresses.slice(totalAddresses.length - 365).map((el) => el?.amount)
          : [],
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
        data: totalAddresses
          ? totalAddresses.slice(totalAddresses.length - 365).map((el) => el?.total)
          : [],
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
  // console.log(
  //   totalAddresses.map((el) => el?.date),
  //   totalAddresses.map((el) => el?.amount),
  //   totalAddresses.map((el) => el?.total)
  // );

  if (error) return <p>Error loading wallet holdings graph</p>;
  // console.log(
  //   alphPriceHistory?.prices.length,
  //   alphPriceHistory?.prices[0][0],
  //   alphPriceHistory?.prices[alphPriceHistory?.prices.length - 1][0]
  // );
  // totalAddresses.slice(totalAddresses.length - 365).forEach((el, index) => {
  //   console.log(
  //     el?.date ===
  //       new Date(alphPriceHistory?.prices[index][0] as number).toLocaleDateString()
  //       ? ""
  //       : "FALSE",
  //     index
  //   );
  // });

  // if (isLoadingHistoryPrice) return <p>Getting data...</p>;
  return (
    <GraphWrapper>
      <div className="mb-4 h-52 xs:h-auto xs:w-full">
        <Line
          ref={chartRef}
          className=""
          data={data}
          options={options}
          plugins={[chartAreaBorder]}
        ></Line>
      </div>
      <div className="flex items-center justify-between">
        <span className=" text-sm md:text-base">
          Time interval:{" "}
          <span
            onClick={onChartInterval}
            className={`cursor-pointer ${
              chartInterval === "day"
                ? " rounded-sm  bg-slate-300 p-1 text-center dark:bg-gray-900  dark:text-blue-100"
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
                ? "rounded-sm  bg-slate-300 p-1 text-center dark:bg-gray-900  dark:text-blue-100"
                : ""
            }`}
          >
            month
          </span>
        </span>
        <button
          className="rounded-md bg-slate-300 p-1 dark:bg-gray-900"
          onClick={() => chartRef.current?.resetZoom()}
        >
          Reset zoom
        </button>
      </div>
    </GraphWrapper>
  );
}

export default TotalAddresses;
