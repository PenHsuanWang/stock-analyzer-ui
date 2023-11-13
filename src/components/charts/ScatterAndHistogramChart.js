import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ScatterController,
  PointElement,
  BarController
} from 'chart.js';
import { Chart } from 'react-chartjs-2';


const binData = (values, binSize) => {
  // Group the data points into bins of the specified size.
  const bins = {};
  values.forEach(value => {
    const bin = Math.floor(value / binSize) * binSize;
    bins[bin] = (bins[bin] || 0) + 1;
  });
  
  // Convert the bins into an array of { x, y } objects for the chart.
  return Object.entries(bins).map(([x, y]) => ({
    x: parseFloat(x),
    y
  }));
};



// Now xHistogramDataPoints and yHistogramDataPoints can be used to create histogram datasets for the chart.

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ScatterController,
  PointElement,
  BarController
);

const options = {
  scales: {
    x: {
      position: 'bottom',
      grid: {
        drawOnChartArea: true,
      },
    },
    y: {
      position: 'left',
      grid: {
        drawOnChartArea: true,
      },
    },
    xHistogram: {
      type: 'linear',
      position: 'top',
      offset: true,
      grid: {
        drawOnChartArea: false,
      },
      afterFit: function(scaleInstance) {
        scaleInstance.height = 30; // or whatever height you want for the histogram
      }
    },
    yHistogram: {
      type: 'linear',
      position: 'right',
      offset: true,
      grid: {
        drawOnChartArea: false,
      },
      afterFit: function(scaleInstance) {
        scaleInstance.width = 30; // or whatever width you want for the histogram
      }
    },
  },
  plugins: {
    tooltip: {
      mode: 'index',
      intersect: false
    }
  }
};

const ScatterAndHistogramChart = ({ data }) => {
  const [histogramData, setHistogramData] = useState({ x: [], y: [] });

  useEffect(() => {
    if (!data) {
      return;
    }
    
    const histogramBinSize = 0.01; // Adjust as needed
    const xValues = data.map(d => d.x);
    const yValues = data.map(d => d.y);

    const xHistogramDataPoints = binData(xValues, histogramBinSize);
    const yHistogramDataPoints = binData(yValues, histogramBinSize);

    setHistogramData({ x: xHistogramDataPoints, y: yHistogramDataPoints });
  }, [data]);

  const chartData = {
    datasets: [
      {
        type: 'scatter',
        label: 'Scatter Dataset',
        data: data,
        backgroundColor: 'rgba(255, 99, 132, 1)',
        xAxisID: 'x',
        yAxisID: 'y'
      },
      // {
      //   type: 'bar',
      //   label: 'X Histogram Dataset',－
      //   data: histogramData.x,
      //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
      //   xAxisID: 'xHistogram',
      //   yAxisID: 'y'
      // },
      // {
      //   type: 'bar',
      //   label: 'Y Histogram Dataset',
      //   data: histogramData.y,
      //   backgroundColor: 'rgba(75, 192, 192, 0.5)',
      //   xAxisID: 'x',
      //   yAxisID: 'yHistogram'
      // }
    ]
  };

  return <Chart type="scatter" options={options} data={chartData} />;
};

export default ScatterAndHistogramChart;
