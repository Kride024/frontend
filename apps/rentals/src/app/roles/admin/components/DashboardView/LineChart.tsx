import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ChartOptions, ChartData } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart: React.FC = () => {
  const data: ChartData<"line"> = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Property Listings",
        data: [150, 230, 225, 220, 140, 148],
        borderColor: "#4c51bf",
        tension: 0.3,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          stepSize: 50,
        },
        beginAtZero: true,
        min: 0,
      },
    },
  };

  return (
    <div className="bg-white shadow-lg p-4 rounded-lg w-full">
      <h2 className="text-lg font-bold mb-3">Property Listings (Monthly)</h2>
      <div className="h-72">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChart;
