// src/components/charts/CandlestickDiagram.js
import React from 'react';
import Plot from 'react-plotly.js';

const CandlestickDiagram = ({ data, selectedPatterns }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data to display or data is in incorrect format.</div>;
  }

  // Construct the candlestick series
  const candlestickSeries = {
    x: data.map(item => item.Date),
    close: data.map(item => item.Close),
    high: data.map(item => item.High),
    low: data.map(item => item.Low),
    open: data.map(item => item.Open),
    increasing: { line: { color: 'green' } },
    decreasing: { line: { color: 'red' } },
    type: 'candlestick',
    name: 'Candlestick Data',
    xaxis: 'x', // Assign to first x-axis
    yaxis: 'y'  // Assign to first y-axis
  };

  // Initialize plot data array with the candlestick series
  const plotData = [candlestickSeries];

  // Add volume series
  const volumeSeries = {
    x: data.map(item => item.Date),
    y: data.map(item => item.Volume),
    type: 'bar',
    name: 'Volume',
    xaxis: 'x', // Assign to first x-axis
    yaxis: 'y2' // Assign to second y-axis (subplot)
  };
  plotData.push(volumeSeries);

  // Add moving average lines
  const colorPalette = ['blue', 'orange', 'green', 'red', 'purple', 'brown', 'pink', 'gray', 'olive', 'cyan'];
  let colorIndex = 0;
  Object.keys(data[0]).forEach(key => {
    if (key.startsWith('MA_')) {
      plotData.push({
        x: data.map(item => item.Date),
        y: data.map(item => item[key]),
        type: 'scatter',
        mode: 'lines',
        name: key,
        line: { color: colorPalette[colorIndex % colorPalette.length] }
      });
      colorIndex++;
    }
  });

  // Initialize an object to store the pattern series
  let patternData = {};

  // Highlight patterns if selectedPatterns is provided and not null
  if (selectedPatterns && selectedPatterns.length > 0) {
    data.forEach(item => {
      if (item.Pattern && selectedPatterns.includes(item.Pattern)) {
        if (!patternData[item.Pattern]) {
          // Initialize the pattern series with an empty array for x and y
          patternData[item.Pattern] = {
            x: [],
            y: [],
            mode: 'markers',
            type: 'scatter',
            marker: {
              symbol: 'square',
              color: 'rgba(0, 0, 0, 0)', // Transparent inner color of marker
              size: 10,
              line: {
                color: 'red', // Red border color
                width: 2 // Border width
              }
            },
            name: item.Pattern // Using the pattern name here for the legend
          };
        }
        // Add the data point to the respective pattern series
        patternData[item.Pattern].x.push(item.Date);
        patternData[item.Pattern].y.push(item.Close);
      }
    });
  }

  // Add each pattern series to plotData
  Object.values(patternData).forEach(patternSeries => {
    plotData.push(patternSeries);
  });

  // Define the layout for subplots
  const layout = {
    title: 'Candlestick Chart',
    xaxis: {
      title: 'Date',
      type: 'date',
      rangeslider: { visible: false },
    },
    yaxis: {
      title: 'Stock Price',
      autorange: true,
      fixedrange: false,
      domain: [0.3, 1] // Allocate space for the upper chart
    },
    yaxis2: {
      title: 'Volume',
      autorange: true,
      fixedrange: false,
      domain: [0, 0.2], // Allocate space for the lower chart
      anchor: 'x' // Link this y-axis to the first x-axis
    },
    legend: {
      // orientation: 'h',
      // y: -0.3 // Adjust legend position to fit in the layout
    },
    grid: {
      rows: 2,       // Two rows: one for candlestick and one for volume
      columns: 1,    // Single column
      pattern: 'independent', // Each row has an independent y-axis
      roworder: 'top to bottom' // Volume is on the bottom
    },
    margin: { t: 30, l: 50, r: 50, b: 50 } // Adjust margins to fit layout
  };

  return (
    <Plot
      data={plotData}
      layout={layout}
      style={{ width: '90%', height: '600px' }}
    />
  );
};

export default CandlestickDiagram;
