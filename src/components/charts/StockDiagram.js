import React from 'react';
import Plot from 'react-plotly.js';

function StockDiagram({ data }) {
  const layout = {
    title: 'Basic Plotly Line Chart',
    xaxis: { title: 'X Axis Label' },
    yaxis: { title: 'Y Axis Label' },
  };

  return (
    <Plot
      data={data}
      layout={layout}
      style={{ width: '80%', height: '400px' }}
    />
  );
}

export default StockDiagram;