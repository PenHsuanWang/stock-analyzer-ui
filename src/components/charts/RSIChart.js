// src/components/charts/RSIChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { getChartOptions } from '../../utils/charts/chartOptions';

const RSIChart = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data to display or data is in incorrect format.</div>;
  }

  const rsiData = data.map(item => item.RSI);
  const dates = data.map(item => item.Date);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'RSI',
        data: rsiData,
        borderColor: 'blue',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        fill: false,
      },
    ],
  };

  const options = getChartOptions('RSI Chart'); // Get a fresh copy of chart options for the RSI chart

  return (
    <div className="plotly-chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default RSIChart;
