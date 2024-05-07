// src/components/charts/RSIChart.js
import React from 'react';
import Plot from 'react-plotly.js';

const RSIChart = ({ data, layout }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data to display or data is in incorrect format.</div>;
  }

  const plotData = [
    {
      x: data.map(item => item.Date),
      y: data.map(item => item.RSI),
      type: 'scatter',
      mode: 'lines',
      name: 'RSI',
      line: { color: 'blue' }
    }
  ];


  return (
    <Plot
      data={plotData}
      layout={layout}
      style={{ width: '100%', height: '100%' }} // Adjust size as needed
    />
  );
};

export default RSIChart;
