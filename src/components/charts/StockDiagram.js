// src/components/charts/StockDiagram.js
import React from 'react';
import Plot from 'react-plotly.js';

const StockDiagram = ({ data }) => {
  // Check if data is an array and not empty
  if (!Array.isArray(data) || data.length === 0) {
    console.error('Data is not an array or it is empty:', data);
    // Handle the error case here, for example by displaying an error message or returning null
    return <div>No data to display or data is in incorrect format</div>;
  }

  // Extract the index as the x-axis and the Close property as the y-axis data
  const plotData = [{
    x: data.map((_, index) => index), // Use index for x-axis data points
    y: data.map(item => item.Close), // Extract Close property for y-axis data points
    type: 'scatter', // Define the type of plot
    mode: 'lines+markers', // Define the mode of the plot
    name: 'Close Price' // Name of the data series
  }];

  const layout = {
    title: 'Stock Price Chart', // Title of the chart
    xaxis: {
      title: 'Index', // Since we don't have date information, use index as x-axis label
    },
    yaxis: {
      title: 'Close Price' // y-axis label
    }
  };

  return (
    <Plot
      data={plotData} // Plotly expects an array of data traces
      layout={layout} // Layout configuration for the plot
      style={{ width: '100%', height: '100%' }} // Style of the plot
    />
  );
};

export default StockDiagram;
