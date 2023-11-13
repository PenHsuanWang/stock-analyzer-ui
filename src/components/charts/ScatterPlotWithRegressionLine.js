import React from 'react';
import Plot from 'react-plotly.js';

const ScatterPlotWithRegressionLine = ({ data }) => {
  // 1. Calculate the regression line
  const { slope, intercept } = calculateRegression(data);

  // 2. Create the line data
  const lineX = [Math.min(...data.map(point => point.x)), Math.max(...data.map(point => point.x))];
  const lineY = lineX.map(x => slope * x + intercept);

  // Scatter plot trace
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

  // Regression line trace
  const lineTrace = {
    x: lineX,
    y: lineY,
    mode: 'lines',
    type: 'scatter',
    line: {
      color: 'red',
      width: 2
    },
    name: 'Regression Line'
  };

  // Layout configuration
  const layout = {
    title: 'Scatter Plot with Regression Line',
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
      data={[scatterTrace, lineTrace]}
      layout={layout}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler={true}
    />
  );
};

// Helper function to calculate the regression line
function calculateRegression(dataPoints) {
  // Simple linear regression algorithm to calculate slope and intercept
  // This is a placeholder function, you should replace it with actual calculation
  const n = dataPoints.length;
  let [xSum, ySum, xySum, xxSum] = [0, 0, 0, 0];

  for (let point of dataPoints) {
    xSum += point.x;
    ySum += point.y;
    xySum += point.x * point.y;
    xxSum += point.x * point.x;
  }

  const slope = (n * xySum - xSum * ySum) / (n * xxSum - xSum * xSum);
  const intercept = (ySum - slope * xSum) / n;

  return { slope, intercept };
}

export default ScatterPlotWithRegressionLine;
