import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Variable Costs", value: 400 },
  { name: "Available Cash", value: 300 },
  { name: "Fixed Cost", value: 300 },
];

const COLORS = ["#0088FE", "#00C49F", "#87CEEB"]; // Define slice colors

const DonutChart = () => {
  return (
    <PieChart width={400} height={350}>
      <Pie
        data={data}
        cx="50%"
        cy="40%" // Adjusted to make space for the legend
        innerRadius={60} // Creates the "donut" effect
        outerRadius={90}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend
        layout="horizontal" // Arrange legend items horizontally
        align="center" // Center the legend horizontally
        verticalAlign="bottom" // Position the legend at the bottom
        wrapperStyle={{ fontSize: "12px" }} // Adjust font size for better fit
      />
    </PieChart>
  );
};

export default DonutChart;
