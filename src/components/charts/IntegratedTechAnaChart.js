// src/components/charts/IntegratedTechAnaChart.js
import React from 'react';
import Plot from 'react-plotly.js';

const IntegratedTechAnaChart = ({ candlestickData, macdData, rsiData }) => {
  if (!candlestickData || candlestickData.length === 0 ||
      !macdData || macdData.length === 0 ||
      !rsiData || rsiData.length === 0) {
    return <div>No data to display or data is in incorrect format.</div>;
  }

  // Construct the candlestick series
  const candlestickSeries = {
    x: candlestickData.map(item => item.Date),
    close: candlestickData.map(item => item.Close),
    high: candlestickData.map(item => item.High),
    low: candlestickData.map(item => item.Low),
    open: candlestickData.map(item => item.Open),
    increasing: { line: { color: 'green' } },
    decreasing: { line: { color: 'red' } },
    type: 'candlestick',
    name: 'Candlestick Data',
    xaxis: 'x',
    yaxis: 'y'
  };

  // Add volume series, overlaying the candlestick chart
  const volumeSeries = {
    x: candlestickData.map(item => item.Date),
    y: candlestickData.map(item => item.Volume),
    type: 'bar',
    name: 'Volume',
    xaxis: 'x',
    yaxis: 'y',
    marker: { color: 'teal' },
    yaxis: 'y2'
  };

// Add MACD Line series
const macdLineSeries = {
  x: macdData.map(item => item.Date),
  y: macdData.map(item => item.MACD),
  type: 'scatter',
  mode: 'lines',
  name: 'MACD Line',
  line: { color: 'blue' },
  xaxis: 'x',
  yaxis: 'y3'
};

// Add Signal Line series
const signalLineSeries = {
  x: macdData.map(item => item.Date),
  y: macdData.map(item => item.signal),
  type: 'scatter',
  mode: 'lines',
  name: 'Signal Line',
  line: { color: 'red' },
  xaxis: 'x',
  yaxis: 'y3'
};

// Add MACD Histogram series
const macdHistogramSeries = {
  x: macdData.map(item => item.Date),
  y: macdData.map(item => item.histogram),
  type: 'bar',
  name: 'Histogram',
  marker: {
    color: macdData.map(item => (item.histogram >= 0 ? 'green' : 'red'))
  },
  xaxis: 'x',
  yaxis: 'y3'
};

  // Construct the RSI series
  const rsiSeries = {
    x: rsiData.map(item => item.Date),
    y: rsiData.map(item => item.RSI),
    type: 'scatter',
    mode: 'lines',
    name: 'RSI',
    line: { color: 'blue' },
    xaxis: 'x',
    yaxis: 'y4'
  };

  // Combine all traces into a single data array for Plotly
  const plotData = [candlestickSeries, volumeSeries, macdLineSeries, signalLineSeries, macdHistogramSeries, rsiSeries];


  // Define the layout for the combined chart with appropriate domains
  const layout = {
    title: 'Integrated Technical Analysis Chart',
    xaxis: {
      title: 'Date',
      type: 'date',
      domain: [0, 1], // Full width
    },
    yaxis: {
      title: 'Stock Price',
      domain: [0.5, 1], // Allocate the top 50% of the grid for the candlestick chart
    },
    yaxis2: {
      title: 'Volume',
      domain: [0.3, 0.5], // Allocate the middle 20% of the grid for Volume
      anchor: 'x',
      side: 'right',
      overlaying: 'y',
    },
    yaxis3: {
      title: 'MACD',
      domain: [0.2, 0.3], // Allocate a portion below volume for MACD
      anchor: 'x',
    },
    yaxis4: {
      title: 'RSI',
      domain: [0, 0.2], // Allocate the bottom 20% for RSI
      anchor: 'x',
    },
    legend: {
      orientation: 'h',
      y: -0.2, // Place the legend below the xaxis
    },
    margin: { t: 50, l: 70, r: 50, b: 50 },
  };

  return (
    <Plot
      data={plotData}
      layout={layout}
      style={{ width: '100%', height: '100%' }}
      config={{ responsive: true }}
    />
  );
};

export default IntegratedTechAnaChart;
