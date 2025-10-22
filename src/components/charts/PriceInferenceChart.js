// src/components/charts/PriceInferenceChart.js
import React from 'react';
import Plot from 'react-plotly.js';

const PriceInferenceChart = ({ data }) => {
  if (!data) return null;

  const plotData = [
    {
      x: data.dates,
      y: data.actual,
      type: 'scatter',
      mode: 'lines',
      name: 'Actual Prices',
      line: { color: 'blue' }
    },
    {
      x: data.dates,
      y: data.predicted,
      type: 'scatter',
      mode: 'lines',
      name: 'Predicted Prices',
      line: { color: 'orange' }
    }
  ];

  const layout = {
    title: 'LSTM Stock Price Prediction',
    xaxis: { title: 'Date' },
    yaxis: { title: 'Price' },
    legend: { orientation: 'h', y: -0.2 }
  };

  return <Plot data={plotData} layout={layout} style={{ width: '100%', height: '500px' }} />;
};

export default PriceInferenceChart;
