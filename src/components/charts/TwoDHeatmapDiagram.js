// components/charts/TwoDHeatmapDiagram.js
import React from 'react';
import Plot from 'react-plotly.js';

function TwoDHeatmapDiagram({ data }) {
  // Assuming 'data' is an object where keys are stock IDs and values are objects with correlations
  const zData = Object.keys(data).map(rowKey => {
    return Object.keys(data).map(columnKey => data[rowKey][columnKey]);
  });

  const layout = {
    title: '2D Heatmap',
    xaxis: {
      title: 'Assets',
      ticks: '', // Remove ticks to avoid clutter
      side: 'bottom'
    },
    yaxis: {
      title: 'Assets',
      ticks: '', // Remove ticks to avoid clutter
      autosize: false // Ensure the plot fits to the div size
    }
  };

  return (
    <div className="TwoDHeatmapDiagram">
      <Plot
        data={[{
          z: zData,
          x: Object.keys(data),
          y: Object.keys(data),
          type: 'heatmap',
          colorscale: 'Viridis'
        }]}
        layout={layout}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default TwoDHeatmapDiagram;
