// src/components/charts/CandlestickDiagram.js
import React from 'react';
import Plot from 'react-plotly.js';

const CandlestickDiagram = ({ data, selectedPatterns }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data to display or data is in incorrect format.</div>;
  }

  console.log(data)

  const plotData = [
    {
      x: data.map(item => item.Date),
      close: data.map(item => item.Close),
      high: data.map(item => item.High),
      low: data.map(item => item.Low),
      open: data.map(item => item.Open),

      // cutomize colors 
      increasing: { line: { color: 'green' } },
      decreasing: { line: { color: 'red' } },

      type: 'candlestick',
      name: 'Candlestick Data'
    }
  ];

  //moving average line implement
  const colorPalette = ['blue', 'orange', 'green', 'red', 'purple', 'brown', 'pink', 'gray', 'olive', 'cyan'];
  let colorIndex = 0;

  if (data.length > 0) {
    Object.keys(data[0]).forEach(key => {
      if (key.startsWith('MA_')) {
        plotData.push({
          x: data.map(item => item.Date),
          y: data.map(item => item[key]),
          type: 'scatter',
          mode: 'lines',
          name: key, 
          line: {
            color: colorPalette[colorIndex % colorPalette.length]
          }
        });
        colorIndex++;
      }
    });
  }

  // Highlight patterns if selectedPatterns is provided
  if (selectedPatterns && selectedPatterns.length > 0) {
    data.forEach((item, index) => {
      if (selectedPatterns.includes(item.Pattern)) {
        plotData.push({
          x: [item.Date],
          y: [item.Close], // or whichever value is relevant for the pattern
          mode: 'markers',
          type: 'scatter',
          marker: {
            symbol: 'square',
            color: 'rgba(0, 0, 0, 0)', // Inner color of marker
            size: 10,
            line: {
              color: 'red', // Border color
              width: 2 // Border width
            }
          },
          name: item.Pattern
        });
      }
    });
  }

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
      fixedrange: false
    }
  };

  return (
    <Plot
      data={plotData}
      layout={layout}
      style={{ width: '100%', height: '400px' }}
    />
  );
};

export default CandlestickDiagram;
