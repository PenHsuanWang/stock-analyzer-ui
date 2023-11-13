import React from 'react';
import Plot from 'react-plotly.js';

const ScatterPlotWithHistograms = ({ data }) => {
  const scatterTrace = {
    x: data.map(point => point.x),
    y: data.map(point => point.y),
    mode: 'markers',
    type: 'scatter',
    marker: {
      color: 'rgba(17, 157, 255, 0.5)',
      size: 8
    },
    name: 'Scatter',
    xaxis: 'x',
    yaxis: 'y'
  };

  const xHistogramTrace = {
    x: data.map(point => point.x),
    type: 'histogram',
    marker: {
      color: 'rgba(17, 157, 255, 0.7)',
    },
    name: 'x Histogram',
    xaxis: 'x2', // Use the top x-axis for the x-histogram
    yaxis: 'y2', // Use the top y-axis for the x-histogram
    orientation: 'v'
  };

  const yHistogramTrace = {
    y: data.map(point => point.y),
    type: 'histogram',
    marker: {
      color: 'rgba(255, 157, 177, 0.7)',
    },
    name: 'y Histogram',
    xaxis: 'x3', // Use the right x-axis for the y-histogram
    yaxis: 'y3', // Use the right y-axis for the y-histogram
    orientation: 'h'
  };

  const layout = {
    grid: {
      rows: 2,
      columns: 2,
      pattern: 'independent',
      subplots: [['xy2', 'x2y2'], ['xy', 'x3y']], // Adjust subplots layout
    },
    xaxis: {
      domain: [0, 0.85], // Scatter plot x-axis
      title: 'GOOG'
    },
    yaxis: {
      domain: [0, 0.85], // Scatter plot y-axis (leave space on the right for y-histogram)
      title: 'MSFT'
    },
    xaxis2: {
      domain: [0, 0.85], // x-Histogram x-axis (aligned with scatter plot x-axis)
      anchor: 'y2',
      showticklabels: false
    },
    yaxis2: {
      domain: [0.85, 1], // x-Histogram y-axis (above the scatter plot)
    },
    xaxis3: {
      domain: [0.85, 1], // y-Histogram x-axis (to the right of the scatter plot)
      anchor: 'y3',
      showticklabels: false
    },
    yaxis3: {
      domain: [0, 0.85], // y-Histogram y-axis (aligned with scatter plot y-axis)
      showticklabels: false
    },
    title: 'Scatter Plot with Marginal Histograms',
    showlegend: false,
    bargap: 0.05,
    margin: {
      l: 40,
      r: 40,
      b: 40,
      t: 40,
      pad: 4
    },
  };

  return (
    <Plot
      data={[xHistogramTrace, yHistogramTrace, scatterTrace]}
      layout={layout}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler={true}
    />
  );
};

export default ScatterPlotWithHistograms;
