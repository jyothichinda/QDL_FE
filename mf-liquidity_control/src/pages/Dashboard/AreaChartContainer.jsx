import React from "react";
import Chart from "react-apexcharts";
import dayjs from "dayjs";

const AreaChartContainer = ({ data }) => {
  const timeStamps = Array.from(
    new Set(data.map((item) => item.timestamp))
  ).sort((a, b) => dayjs(a).diff(dayjs(b)));

  const cashInflowData = timeStamps.map((time) => {
    const entry = data.find(
      (item) => item.timestamp === time && item.title === "Current Cash InFlow"
    );
    return entry ? parseFloat(entry.amount) : 0;
  });

  const cashOutflowData = timeStamps.map((time) => {
    const entry = data.find(
      (item) => item.timestamp === time && item.title === "Current Cash OutFlow"
    );
    return entry ? parseFloat(entry.amount) : 0;
  });

  return (
    <Chart
      options={{
        chart: {
          type: "area",
          stacked: true,
          toolbar: { show: false },
        },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 2 },
        xaxis: {
          type: "datetime",
          categories: timeStamps,
          labels: {
            format: "HH:mm",
            datetimeUTC: false,
          },
        },
        yaxis: {
          labels: { formatter: (val) => `$${val.toFixed(2)}` },
        },
        tooltip: {
          x: { format: "YYYY-MM-DD HH:mm" },
        },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
          fontSize: "10px",
          markers: {
            width: 12,
            height: 12,
          },
        },
        colors: ["#A93226", "#2874A6"], // Custom colors for Cash Outflows and Cash Inflows
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3,
            stops: [0, 90, 100],
          },
        },
        title: {
          text: "Hourly Cash Flow Forecast",
          align: "center",
          style: {
            fontSize: "16px",
            fontWeight: "bold",
          },
        },
      }}
      series={[
        { name: "Cash OutFlows", data: cashOutflowData },
        { name: "Cash In Flows", data: cashInflowData },
      ]}
      type="area"
      height="350"
      width="100%"
    />
  );
};

export default AreaChartContainer;