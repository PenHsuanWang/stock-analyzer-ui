import React from 'react';
import Plot from 'react-plotly.js';

const PairGridPlot = ({ data }) => {
  const traces = [];
  const variables = Object.keys(data);
  const numberOfVariables = variables.length;

  const layout = {
    title: 'PairGrid Plot',
    showlegend: false,
    autosize: true,
    grid: {
      rows: numberOfVariables,
      columns: numberOfVariables,
      pattern: 'independent',
    },
  };

  const updatedLayout = { ...layout };
  variables.forEach((variable, index) => {
    updatedLayout[`xaxis${index + 1}`] = {
      domain: [(index % numberOfVariables) / numberOfVariables, (index % numberOfVariables + 1) / numberOfVariables],
      anchor: `y${index + 1}`,
      title: variable,
    };
    updatedLayout[`yaxis${index + 1}`] = {
      domain: [1 - Math.floor(index / numberOfVariables + 1) / numberOfVariables, 1 - Math.floor(index / numberOfVariables) / numberOfVariables],
      anchor: `x${index + 1}`,
      title: variable,
    };
  });


  // Add traces for each pair of variables
  variables.forEach((varY, rowIndex) => {
    variables.forEach((varX, colIndex) => {
      const axisIndex = rowIndex * numberOfVariables + colIndex + 1;
      const xaxis = `x${axisIndex}`;
      const yaxis = `y${axisIndex}`;
  
      if (rowIndex === colIndex) {
        // draw histogram if the plot on the diagnal line
        traces.push({
          x: data[varX],
          type: 'histogram',
          xaxis: xaxis,
          yaxis: yaxis,
          marker: { color: '#636efa' },
        });
      } else {
        // draw scatter if  the plot on the non-diagnal li 
        traces.push({
          x: data[varX],
          y: data[varY],
          mode: 'markers',
          type: 'scatter',
          xaxis: xaxis,
          yaxis: yaxis,
          marker: { color: '#00bfd8', size: 6 },
        });
      }
    });
  });

  // Update the layout after all traces have been added
  const finalLayout = {
    ...updatedLayout,
    grid: { rows: numberOfVariables, columns: numberOfVariables, pattern: 'independent' },
    // ... any other layout settings you need
  };

  return (
    <Plot
      data={traces}
      layout={finalLayout}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler={true}
      config={{ responsive: true }}
    />
  );
};

export default PairGridPlot;
