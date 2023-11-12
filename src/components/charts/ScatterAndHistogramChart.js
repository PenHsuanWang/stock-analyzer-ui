import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ScatterController, PointElement } from 'chart.js';
import { Scatter, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ScatterController,
  PointElement
);

export const options = {
  scales: {
    x: {
      type: 'linear',
      position: 'bottom'
    }
  }
};

const ScatterAndHistogramChart = ({ data }) => {

  // setup scatter 
  const scatterData = {
    datasets: [
      {
        label: 'Scatter Dataset',
        data: data.map(d => ({ x: d.x, y: d.y })),
        backgroundColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  // setup histogram
  const histogramData = {
    labels: data.map(d => d.label), // fake data lebel
    datasets: [
      {
        label: 'Histogram Dataset',
        data: data.map(d => d.y),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div>
      <Scatter options={options} data={scatterData} />
      <Bar options={options} data={histogramData} />
    </div>
  );
};

export default ScatterAndHistogramChart;
