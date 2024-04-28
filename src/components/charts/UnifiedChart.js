// src/components/charts/UnifiedChart.js
import React from 'react';
import Plot from 'react-plotly.js';

const UnifiedChart = ({ data, chartType }) => {
  // Helper function to create the chart data for Plotly based on the chart type
  const getPlotlyData = (data, chartType) => {
    switch (chartType) {
      case 'candlestick':
        return [
          {
            x: data.map(d => d.date),
            close: data.map(d => d.close),
            high: data.map(d => d.high),
            low: data.map(d => d.low),
            open: data.map(d => d.open),
            increasing: { line: { color: 'green' } },
            decreasing: { line: { color: 'red' } },
            type: 'candlestick',
          },
        ];
      case 'MACD':
        return [
          {
            x: data.map(d => d.date),
            y: data.map(d => d.macd),
            type: 'scatter',
            mode: 'lines',
            name: 'MACD',
            line: { color: '#17BECF' },
          },
          {
            x: data.map(d => d.date),
            y: data.map(d => d.signal),
            type: 'scatter',
            mode: 'lines',
            name: 'Signal',
            line: { color: '#7F7F7F' },
          },
          {
            x: data.map(d => d.date),
            y: data.map(d => d.histogram),
            type: 'bar',
            name: 'Histogram',
          },
        ];
      case 'RSI':
        return [
          {
            x: data.map(d => d.date),
            y: data.map(d => d.rsi),
            type: 'scatter',
            mode: 'lines',
            name: 'RSI',
            line: { color: 'blue' },
          },
        ];
      default:
        return [];
    }
  };

  // Helper function to create a layout for Plotly charts
  const getLayout = (chartType) => {
    return {
      title: `${chartType} Chart`,
      xaxis: {
        title: 'Date',
        type: 'date',
      },
      yaxis: {
        title: `${chartType} Value`,
      },
      dragmode: 'pan', // This enables panning by default
      // You can add more layout configuration here
    };
  };

  const plotlyData = getPlotlyData(data, chartType);
  const layout = getLayout(chartType);

  return (
    <Plot
      data={plotlyData}
      layout={layout}
      frames={[]}
      config={{ responsive: true }}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default UnifiedChart;
