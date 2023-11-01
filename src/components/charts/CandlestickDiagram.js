// src/components/charts/CandlestickDiagram.js
import React from 'react';
import Plot from 'react-plotly.js';

const CandlestickDiagram = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data to display or data is in incorrect format.</div>;
  }

  const plotData = [
    {
      x: data.map(item => item.Date),
      close: data.map(item => item.Close),
      high: data.map(item => item.High),
      low: data.map(item => item.Low),
      open: data.map(item => item.Open),

      // cutomize colors 
      increasing: { line: { color: 'green' } },
      decreasing: { line: { color: 'red' } },

      type: 'candlestick',
      name: 'Candlestick Data'
    }
  ];

  const layout = {
    title: 'Candlestick Chart',
    xaxis: {
      title: 'Date',
      type: 'date'
    },
    yaxis: {
      title: 'Stock Price'
    }
  };

  return (
    <Plot
      data={plotData}
      layout={layout}
      style={{ width: '100%', height: '400px' }}
    />
  );
};

export default CandlestickDiagram;
