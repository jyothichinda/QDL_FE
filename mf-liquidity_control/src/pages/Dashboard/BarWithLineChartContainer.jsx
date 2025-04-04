import React from "react";
import ReactApexChart from "react-apexcharts";

const BarWithLineChartContainer = ({ data = [
  {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
    ],
    series: [
      {
        name: "Debt",
        type: "column",
        data: [30000, 35000, 32000, 40000, 45000, 37000, 50000, 34000, 31000],
      },
      {
        name: "Equity",
        type: "column",
        data: [25000, 30000, 27000, 26000, 28000, 29000, 27000, 30000, 40000],
      },
    ],
  },
] }) => {
  // Extract categories and series data
  const categories = data[0]?.categories || []; // Use categories from the first object
  const inflowData = data[0]?.series[0]?.data || []; // Use data from the first series
  const outflowData = data[0]?.series[1]?.data || []; // Use data from the second series

  const chartOptions = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: { show: false },
    },
    xaxis: {
      categories, // Categories for the x-axis
    },
    yaxis: [
      {
        title: { text: "Amount (in Thousands)" },
        min: 0,
        labels: {
          formatter: (val) => `$${(val / 1000).toFixed(2)}k`, // Format as thousands
        },
      },
    ],
    stroke: {
      width: [0, 0, 2], // Apply stroke width only for line series
    },
    markers: {
      size: [0, 0, 5], // Show markers for the line graph
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `$${val.toFixed(2)}`, // Format tooltip values
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
  };

  const chartSeries = [
    {
      name: "Inflow",
      type: "bar",
      data: inflowData,
    },
    {
      name: "Outflow",
      type: "bar",
      data: outflowData,
    },
  ];

  return (
    <ReactApexChart
      options={chartOptions}
      series={chartSeries}
      type="line"
      height={350}
    />
  );
};

export default BarWithLineChartContainer;
