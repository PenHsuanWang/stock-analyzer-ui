// src/components/charts/MACDChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { getChartOptions } from '../../utils/charts/chartOptions';

const MACDChart = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data to display or data is in incorrect format.</div>;
  }

  const macdLineData = data.map(item => item.MACD);
  const signalLineData = data.map(item => item.signal);
  const histogramData = data.map(item => item.histogram);
  const dates = data.map(item => item.Date);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'MACD Line',
        data: macdLineData,
        borderColor: 'blue',
        type: 'line',
        fill: false,
      },
      {
        label: 'Signal Line',
        data: signalLineData,
        borderColor: 'orange',
        type: 'line',
        fill: false,
      },
      {
        label: 'Histogram',
        data: histogramData,
        backgroundColor: 'grey',
        borderColor: 'grey',
      },
    ],
  };

  const options = getChartOptions('MACD Chart'); // Get a fresh copy of chart options for the MACD chart
  options.scales.y = { // Add a Y-axis scale specific to MACD chart if needed
    beginAtZero: true,
    title: {
      display: true,
      text: 'Value',
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default MACDChart;
