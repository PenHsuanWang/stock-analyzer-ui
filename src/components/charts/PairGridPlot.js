import React from 'react';
import Plot from 'react-plotly.js';
import { make_subplots } from 'plotly.js-dist-min';

const PairGridPlot = ({ data }) => {
  // fetch the variable from outer function
  const variables = Object.keys(data);
  const numberOfVariables = variables.length;

  const subplotsLayout = make_subplots({
    rows: numberOfVariables,
    cols: numberOfVariables,
    sharedXaxes: true,
    sharedYaxes: true,
    vertical_spacing: 0.05,
    horizontal_spacing: 0.05,
    subplot_titles: variables // options: the title for subplot
  });

  variables.forEach((varY, rowIndex) => {
    variables.forEach((varX, colIndex) => {
      if (rowIndex === colIndex) {
        // histogram on the diagnal line
        subplotsLayout.add_trace({
          x: data[varX],
          type: 'histogram',
          name: varX,
          xaxis: `x${colIndex + 1}`,
          yaxis: `y${rowIndex + 1}`
        }, rowIndex + 1, colIndex + 1);
      } else {
        // scatter plot in the grid
        subplotsLayout.add_trace({
          x: data[varX],
          y: data[varY],
          mode: 'markers',
          type: 'scatter',
          name: `${varX} vs ${varY}`,
          xaxis: `x${colIndex + 1}`,
          yaxis: `y${rowIndex + 1}`
        }, rowIndex + 1, colIndex + 1);
        
        // optional for add regression line
      }
    });
  });

  // setup layout
  const layout = {
    ...subplotsLayout.layout,
    title: 'PairGrid Plot',
    height: 800,
    width: 800,
    showlegend: false
  };

  return (
    <Plot
      data={subplotsLayout.data}
      layout={layout}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler={true}
    />
  );
};

export default PairGridPlot;
