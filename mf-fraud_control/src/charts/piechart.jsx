// ../charts/piechart.js
import React from 'react';
import { Pie } from '@ant-design/charts';

const PieChart = () => {
  const data = [
    { type: 'Category A', value: 27 },
    { type: 'Category B', value: 25 },
    { type: 'Category C', value: 18 },
    { type: 'Category D', value: 15 },
  ];

  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
  };

  return <Pie {...config} />;
};

export default PieChart;