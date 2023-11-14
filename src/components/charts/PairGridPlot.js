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

  // 初始化轴的配置
  for (let i = 1; i <= numberOfVariables; i++) {
    layout[`xaxis${i}`] = {
      domain: [(i - 1) / numberOfVariables, i / numberOfVariables],
      anchor: `y${i}`,
      title: variables[i - 1]
    };
    layout[`yaxis${i}`] = {
      domain: [1 - i / numberOfVariables, 1 - (i - 1) / numberOfVariables],
      anchor: `x${i}`,
      title: variables[i - 1]
    };
  }

  const newLayout = { ...layout };
  Object.keys(newLayout).forEach(key => {
    if (key.startsWith('xaxis') || key.startsWith('yaxis')) {
      const axisIndex = parseInt(key.replace(/^\D+/g, ''));
      if (axisIndex > numberOfVariables) {
        delete newLayout[key]; // 删除多余的轴配置
      }
    }
  });

  // Add traces for each pair of variables
  variables.forEach((varY, rowIndex) => {
    variables.forEach((varX, colIndex) => {
      const xaxis = `x${colIndex + 1}`;
      const yaxis = `y${rowIndex + 1}`;

      if (rowIndex === colIndex) {
        // Diagonal - add histogram
        traces.push({
          x: data[varX],
          type: 'histogram',
          xaxis: xaxis,
          yaxis: yaxis,
          marker: { color: '#636efa' },
        });
      } else {
        // Off-diagonal - add scatter
        traces.push({
          x: data[varX],
          y: data[varY],
          mode: 'markers',
          type: 'scatter',
          xaxis: xaxis,
          yaxis: yaxis,
          marker: { color: '#00bfd8', size: 3 },
        });
        
      }
    });
  });

  return (
    <Plot
      data={traces}
      layout={newLayout}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler={true}
      config={{ responsive: true }}
    />
  );
};

export default PairGridPlot;
