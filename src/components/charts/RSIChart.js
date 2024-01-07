import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import 'chartjs-plugin-annotation';

// Register the necessary chart components
ChartJS.register(...registerables);

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
        fill: false,
      }
    ]
  };

  const options = {
    title: {
      display: true,
      text: 'RSI Chart',
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'day'
        },
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'RSI'
        }
      }]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 70,
          borderColor: 'red',
          borderWidth: 2,
          label: {
            enabled: true,
            content: 'Overbought (70)',
          }
        },
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 30,
          borderColor: 'green',
          borderWidth: 2,
          label: {
            enabled: true,
            content: 'Oversold (30)',
          }
        }
      ]
    }
  };

  return <Line data={chartData} options={options} />;
};

export default RSIChart;
