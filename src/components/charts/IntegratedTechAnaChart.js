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
    yaxis: 'y2',
    marker: { color: 'teal' },
    showlegend: false
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

  // Add MACD Histogram series, ensuring visibility
  const macdHistogramSeries = {
    x: macdData.map(item => item.Date),
    y: macdData.map(item => Number(item.MACD_Histogram) || 0), // Make sure this matches the backend property name
    type: 'bar',
    name: 'Histogram',
    marker: {
      color: macdData.map(item =>
        (item.MACD_Histogram !== undefined ? (item.MACD_Histogram >= 0 ? 'green' : 'red') : 'lightgrey') // Again, match the property name
      )
    },
    width: 0.5, // Adjust width for visibility
    xaxis: 'x',
    yaxis: 'y3'
  };

  const signalLineSeries = {
    x: macdData.map(item => item.Date),
    y: macdData.map(item => Number(item.Signal_Line) || 0), // Make sure this matches the backend property name
    type: 'scatter',
    mode: 'lines',
    name: 'Signal Line',
    line: { color: 'red' },
    xaxis: 'x',
    yaxis: 'y3'
  };


  // Construct the RSI series with overbought and oversold lines
  const rsiSeries = {
    x: rsiData.map(item => item.Date),
    y: rsiData.map(item => item.RSI),
    type: 'scatter',
    mode: 'lines',
    name: 'RSI',
    line: { color: 'purple' }, // Changed for visibility
    xaxis: 'x',
    yaxis: 'y4'
  };

  // Overbought line (typically at 70)
  const rsiOverboughtSeries = {
    x: rsiData.map(item => item.Date),
    y: new Array(rsiData.length).fill(70), // Fill an array with the value 70
    type: 'scatter',
    mode: 'lines',
    name: 'Overbought',
    line: { color: 'red', dash: 'dash' }, // Dashed line for threshold
    xaxis: 'x',
    yaxis: 'y4'
  };

  // Oversold line (typically at 30)
  const rsiOversoldSeries = {
    x: rsiData.map(item => item.Date),
    y: new Array(rsiData.length).fill(30), // Fill an array with the value 30
    type: 'scatter',
    mode: 'lines',
    name: 'Oversold',
    line: { color: 'green', dash: 'dash' }, // Dashed line for threshold
    xaxis: 'x',
    yaxis: 'y4'
  };


  // Define the layout with the rangeslider only for the candlestick data
  const layout = {
    title: 'Integrated Technical Analysis Chart',
    xaxis: {
      title: 'Date',
      type: 'date',
      domain: [0, 1], // Full width
      rangeslider: { // Enable the range slider for the x-axis
        visible: true,
        borderwidth: 1,
        bordercolor: '#cccccc',
        thickness: 0.15, // Adjust thickness to your preference
        bgcolor: '#e2e2e2', // Background color of the rangeslider
      },
      rangeselector: { // Optional range selector buttons
        buttons: [
          { count: 1, label: '1M', step: 'month', stepmode: 'backward' },
          { count: 6, label: '6M', step: 'month', stepmode: 'backward' },
          { step: 'all' },
        ]
      },
    },
    yaxis: {
      title: 'Stock Price',
      domain: [0.5, 1], // Adjusted to make space for volume histogram at half height
    },
    yaxis2: {
      title: 'Volume',
      domain: [0.4, 0.5], // Reduced height to half by adjusting both ends of the domain
      anchor: 'x',
      side: 'right',
      overlaying: 'y',
    },
    yaxis3: {
      title: 'MACD',
      domain: [0.2, 0.4], // Increased from [0.05, 0.15]
      anchor: 'x',
    },
    yaxis4: {
      title: 'RSI',
      domain: [0.05, 0.2], // Increased from [0, 0.05]
      anchor: 'x',
    },
    legend: {
      orientation: 'h',
      y: -0.2, // Place the legend below the xaxis
    },
    margin: { t: 50, l: 70, r: 50, b: 50 },
    barmode: 'group',
  };


  // Combine all traces into a single data array for Plotly
  const plotData = [
    candlestickSeries,
    volumeSeries,
    macdLineSeries,
    signalLineSeries,
    macdHistogramSeries,
    rsiSeries,
    rsiOverboughtSeries,
    rsiOversoldSeries 
  ];

  
  console.log('Rendering Plot with the following data and layout:');
  console.log('Plot Data:', plotData);
  console.log('Layout:', layout);

  return (
    <Plot
      data={plotData}
      layout={layout}
      style={{ width: '100%', height: '100%' }} // Ensure Plotly chart fills the container
      useResizeHandler={true} // Add this property to make the chart responsive
      config={{ responsive: true }}
    />
  );
};

export default IntegratedTechAnaChart;
