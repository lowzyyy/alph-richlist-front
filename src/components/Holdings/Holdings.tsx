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
} from "chart.js";
ChartJS.register(CategoryScale, LogarithmicScale, BarElement, Title, Tooltip, Legend);
import { Bar } from "react-chartjs-2";

//my imports
import { AddressHoldings } from "./HoldingsTypes";
import { labels, options } from "./graphSettings";

type Props = {
  HOLDINGS_API: string;
};

function Holdings({ HOLDINGS_API }: Props) {
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
      <p className="mb-1 text-center text-xs font-medium text-gray-600 xs:text-sm lg:text-base lg:font-medium">
        Number of wallets per amount
      </p>
      <Bar className="mb-4" data={data} options={options}></Bar>
      <p className="text-xs text-gray-500 xs:text-sm">
        *include/exclude Genesis, Exchange, Pool addresses
      </p>
    </div>
  );
}

export default Holdings;
