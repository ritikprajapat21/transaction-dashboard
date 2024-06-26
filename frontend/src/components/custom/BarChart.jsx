import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useData from "@/hooks/useData";

ChartJs.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const BarChart = () => {
  const [labels, setLabels] = useState([]);
  const [count, setCount] = useState([]);
  const {
    result: { bar: data },
  } = useData();

  useEffect(() => {
    if (data) {
      data.data.sort((a, b) => {
        const aMax = a.range.split("-")[1];
        const bMin = b.range.split("-")[0];

        return aMax - bMin;
      });

      const labels = data.data.map((t) => t.range);
      setLabels(labels);

      const count = data.data.map((t) => t.count);
      setCount(count);
    }
  }, [data]);

  return (
    <div className="relative lg:w-1/2 lg:h-full mx-auto my-8">
      <Bar
        data={{
          labels: labels,
          datasets: [
            {
              label: "Number of items",
              data: count,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              labels: { font: { size: 15 } },
            },
          },
          scales: {
            x: { ticks: { font: { size: 13 } } },
            y: { ticks: { font: { size: 13 } } },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
