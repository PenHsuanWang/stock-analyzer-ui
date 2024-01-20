// src/components/charts/MACDChart.js
import React from 'react';
import Plot from 'react-plotly.js';

const MACDChart = ({ data, layout }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data to display or data is in incorrect format.</div>;
  }

  const plotData = [
    {
      x: data.map(item => item.Date),
      y: data.map(item => item.MACD),
      type: 'scatter',
      mode: 'lines',
      name: 'MACD Line',
      line: { color: 'blue' }
    },
    {
      x: data.map(item => item.Date),
      y: data.map(item => item.signal),
      type: 'scatter',
      mode: 'lines',
      name: 'Signal Line',
      line: { color: 'orange' }
    },
    {
      x: data.map(item => item.Date),
      y: data.map(item => item.histogram),
      type: 'bar',
      name: 'Histogram',
      marker: { color: 'grey' }
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

export default MACDChart;
