import React from 'react';

import { Bar } from '@ant-design/charts';
 
const BarChart = () => {

    const data = [

        { category: 'A', value: 10 },

        { category: 'B', value: 20 },

        { category: 'C', value: 30 },

        { category: 'D', value: 40 },

    ];
 
    const config = {

        data,

        xField: 'value',

        yField: 'category',

        seriesField: 'category',

        color: ['#1890ff'],

    };
 
    return <Bar {...config} />;

};
 
export default BarChart;

 