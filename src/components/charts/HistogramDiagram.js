import React from 'react';
import Plot from 'react-plotly.js';

const HistogramDiagram = ({ data }) => {
  return (
    <Plot
      data={[
        {
          x: data,
          type: 'histogram',
          nbinsx: 30, // specify the number of bins
        },
      ]}
      layout={{
        width: 720,
        height: 400,
        title: 'Daily Return Distribution',
        xaxis: {
          title: 'Daily Return',
          automargin: true, // this ensures that the title has enough space
        },
        yaxis: {
          title: 'Frequency',
          automargin: true, // this ensures that the title has enough space
        },
        bargap: 0.05, // adjust the gap between bars
      }}
      useResizeHandler
      style={{ width: "100%", height: "100%" }} // this makes the plot responsive
    />
  );
};

export default HistogramDiagram;
