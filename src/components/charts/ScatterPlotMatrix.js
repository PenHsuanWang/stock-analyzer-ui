import React from 'react';
import Plot from 'react-plotly.js';

const SimpleScatterSimple = ({ data }) => {
  const scatterTrace = {
    x: data.map(point => point.x),
    y: data.map(point => point.y),
    mode: 'markers',
    type: 'scatter',
    marker: {
      color: 'rgba(17, 157, 255, 0.5)',
      size: 8
    },
    name: 'Scatter'
  };

  const layout = {
    title: 'Simple Scatter Plot',
    xaxis: {
      title: 'X Axis'
    },
    yaxis: {
      title: 'Y Axis'
    },
    margin: {
      l: 40,
      r: 30,
      b: 40,
      t: 40,
      pad: 4
    }
  };

  return (
    <Plot
      data={[scatterTrace]}
      layout={layout}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler={true}
    />
  );
};

export default SimpleScatterSimple;
