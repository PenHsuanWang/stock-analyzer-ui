import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import 'chartjs-plugin-annotation';

// Register the necessary chart components
ChartJS.register(...registerables);

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
        fill: false,
        yAxisID: 'y-axis-1',
      },
      {
        label: 'Signal Line',
        data: signalLineData,
        borderColor: 'orange',
        fill: false,
        yAxisID: 'y-axis-1',
      },
      {
        label: 'Histogram',
        data: histogramData,
        type: 'bar',
        backgroundColor: 'grey',
        yAxisID: 'y-axis-2',
      }
    ],
  };

  const options = {
    responsive: true,
    title: {
      display: true,
      text: 'MACD Chart',
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'day'
        },
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Date'
        },
        ticks: {
          maxRotation: 0
        }
      }],
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: 'Value'
          }
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: false,
          position: 'right',
          gridLines: {
            drawOnChartArea: false,
          },
          scaleLabel: {
            display: true,
            labelString: 'Histogram'
          }
        }
      ]
    }
  };

  return <Line data={chartData} options={options} />;
};

export default MACDChart;
