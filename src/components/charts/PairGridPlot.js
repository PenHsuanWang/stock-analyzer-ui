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
  const updatedLayout = { ...layout };
  for (let i = 1; i <= numberOfVariables; i++) {
    updatedLayout[`xaxis${i}`] = {
      ...updatedLayout[`xaxis${i}`], // 保留已有配置
      domain: [(i - 1) / numberOfVariables, i / numberOfVariables],
      anchor: `y${i}`,
      title: variables[i - 1],
    };
    updatedLayout[`yaxis${i}`] = {
      ...updatedLayout[`yaxis${i}`], // 保留已有配置
      domain: [1 - i / numberOfVariables, 1 - (i - 1) / numberOfVariables],
      anchor: `x${i}`,
      title: variables[i - 1],
    };
  }

  // Add traces for each pair of variables
  variables.forEach((varY, rowIndex) => {
    variables.forEach((varX, colIndex) => {
      const xaxis = `x${colIndex + 1}`;
      const yaxis = `y${rowIndex + 1}`;

      if (rowIndex === colIndex) {
        // Diagonal - add histogram
        
        const histogramTrace = {
          x: data[varX],
          type: 'histogram',
          xaxis: xaxis,
          yaxis: yaxis,
          marker: { color: '#636efa' },
        };
        traces.push(histogramTrace);
        // Update the range for the y-axis of the histogram to fit the frequency of data
        // updatedLayout[`yaxis${rowIndex + 1}`].range = [0, Math.max(...histogramTrace.x.map(xValue => histogramTrace.x.filter(v => v === xValue).length))];

      } else {

        const xData = data[varX].filter(value => typeof value === 'number');
        const yData = data[varY].filter(value => typeof value === 'number');
  
        // Calculate the range and update the layout if there's enough variability in the data
        const xRange = Math.max(...xData) - Math.min(...xData);
        const yRange = Math.max(...yData) - Math.min(...yData);
  
        if (xRange > 0) {
          updatedLayout[`xaxis${colIndex + 1}`].range = [Math.min(...xData), Math.max(...xData)];
        }
  
        if (yRange > 0) {
          updatedLayout[`yaxis${rowIndex + 1}`].range = [Math.min(...yData), Math.max(...yData)];
        }
        
        // Add the scatter trace
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

  return (
    <Plot
      data={traces}
      layout={updatedLayout}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler={true}
      config={{ responsive: true }}
    />
  );
};

export default PairGridPlot;
