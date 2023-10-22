// components/charts/TwoDHeatmapDiagram.js
import React from 'react';
import Plot from 'react-plotly.js';

function TwoDHeatmapDiagram({ data }) {
  const layout = {
    title: '2D Heatmap',
    xaxis: {
      title: 'X Axis Label',
      side: 'bottom'
    },
    yaxis: {
      title: 'Y Axis Label'
    }
  };

  return (
    <div className="TwoDHeatmapDiagram">
      <Plot
        data={[{
          z: data.values, // This is where your 2D data array will go
          type: 'heatmap',
          colorscale: 'Viridis'
        }]}
        layout={layout}
        style={{ width: '80%', height: '400px' }}
      />
    </div>
  );
}

export default TwoDHeatmapDiagram;
