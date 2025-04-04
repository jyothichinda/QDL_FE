import React from 'react';
import { Line } from '@ant-design/charts';
 
const LineChart = () => {
    const data = [
        { year: '2010', value: 30 },
        { year: '2011', value: 50 },
        { year: '2012', value: 40 },
        { year: '2013', value: 70 },
        { year: '2014', value: 60 },
    ];
 
    const config = {
        data,
        xField: 'year',
        yField: 'value',
        point: { size: 5, shape: 'diamond' },
        color: '#f759ab',
    };
 
    return <Line {...config} />;
};
 
export default LineChart;