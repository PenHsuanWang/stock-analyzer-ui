// src/components/charts/MACDChart.js
import React from 'react';
import Plot from 'react-plotly.js';

const MACDChart = ({ macdData }) => {
  if (!macdData || macdData.length === 0) {
    // Display a message if no data is available or data format is incorrect
    return <div>No data to display or data is in incorrect format.</div>;
  }

  // Construct the MACD line trace
  const macdLine = {
    x: macdData.map(item => item.Date), // Ensure date fields match your data structure
    y: macdData.map(item => item.MACD), // Use correct field name for MACD
    type: 'scatter',
    mode: 'lines',
    name: 'MACD Line',
    line: { color: 'blue' },
  };

  // Construct the signal line trace
  const signalLine = {
    x: macdData.map(item => item.Date), // Ensure date fields match your data structure
    y: macdData.map(item => item.Signal_Line), // Use correct field name for Signal Line
    type: 'scatter',
    mode: 'lines',
    name: 'Signal Line',
    line: { color: 'red' },
  };

  // Construct the MACD histogram trace
  const macdHistogram = {
    x: macdData.map(item => item.Date), // Ensure date fields match your data structure
    y: macdData.map(item => item.MACD_Histogram), // Use correct field name for MACD Histogram
    type: 'bar',
    name: 'Histogram',
    marker: {
      color: macdData.map(item => (item.MACD_Histogram >= 0 ? 'green' : 'red')), // Green for positive, red for negative
    },
  };

  // Define the chart layout
  const layout = {
    title: 'MACD Chart',
    xaxis: { domain: [0, 1] }, // Full width for x-axis
    yaxis: { 
      title: 'MACD',
      zeroline: true, // Zero line for reference
      zerolinecolor: 'black',
      zerolinewidth: 2,
    },
  };

  // Combine all traces for plotting
  const data = [macdLine, signalLine, macdHistogram];

  return (
    <Plot
      data={data}
      layout={layout}
      style={{ width: '100%', height: '100%' }} // Responsive design for the plot
    />
  );
};

export default MACDChart;
