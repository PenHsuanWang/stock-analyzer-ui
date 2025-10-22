// src/components/charts/CandlestickDiagram.js
import React from 'react';
import Plot from 'react-plotly.js';

const CandlestickDiagram = ({ data, selectedPatterns }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: '#6b7280',
        background: '#f9fafb',
        borderRadius: '8px',
        border: '1px dashed #e5e7eb'
      }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          No data to display or data is in incorrect format.
        </p>
      </div>
    );
  }

  // Construct the candlestick series
  const candlestickSeries = {
    x: data.map(item => item.Date),
    close: data.map(item => item.Close),
    high: data.map(item => item.High),
    low: data.map(item => item.Low),
    open: data.map(item => item.Open),
    increasing: { line: { color: '#10b981' } },
    decreasing: { line: { color: '#ef4444' } },
    type: 'candlestick',
    name: 'Price',
    xaxis: 'x',
    yaxis: 'y'
  };

  // Initialize plot data array with the candlestick series
  const plotData = [candlestickSeries];

  // Add volume series
  const volumeSeries = {
    x: data.map(item => item.Date),
    y: data.map(item => item.Volume),
    type: 'bar',
    name: 'Volume',
    marker: {
      color: data.map((item, i) => {
        if (i === 0) return '#94a3b8';
        return item.Close >= data[i-1].Close ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)';
      })
    },
    xaxis: 'x',
    yaxis: 'y2'
  };
  plotData.push(volumeSeries);

  // Add moving average lines
  const colorPalette = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];
  let colorIndex = 0;
  Object.keys(data[0]).forEach(key => {
    if (key.startsWith('MA_')) {
      plotData.push({
        x: data.map(item => item.Date),
        y: data.map(item => item[key]),
        type: 'scatter',
        mode: 'lines',
        name: key,
        line: { 
          color: colorPalette[colorIndex % colorPalette.length],
          width: 2
        }
      });
      colorIndex++;
    }
  });

  // Initialize an object to store the pattern series
  let patternData = {};

  // Pattern color mapping for better differentiation
  const patternColors = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
    '#ec4899', '#f97316', '#14b8a6', '#6366f1', '#84cc16'
  ];

  // Highlight patterns if selectedPatterns is provided and not null
  if (selectedPatterns && selectedPatterns.length > 0) {
    data.forEach(item => {
      if (item.Pattern && selectedPatterns.includes(item.Pattern)) {
        if (!patternData[item.Pattern]) {
          const colorIndex = selectedPatterns.indexOf(item.Pattern);
          const patternColor = patternColors[colorIndex % patternColors.length];
          
          patternData[item.Pattern] = {
            x: [],
            y: [],
            mode: 'markers',
            type: 'scatter',
            marker: {
              symbol: 'diamond',
              color: 'rgba(0, 0, 0, 0)',
              size: 12,
              line: {
                color: patternColor,
                width: 3
              }
            },
            name: item.Pattern,
            hovertemplate: `<b>${item.Pattern}</b><br>Date: %{x}<br>Price: $%{y:.2f}<extra></extra>`
          };
        }
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
    autosize: true,
    title: {
      text: 'Candlestick Chart with Pattern Recognition',
      font: { size: 18, weight: 600, color: '#111827' }
    },
    xaxis: {
      title: 'Date',
      type: 'date',
      rangeslider: { visible: false },
      gridcolor: '#f3f4f6',
      showgrid: true
    },
    yaxis: {
      title: 'Price ($)',
      autorange: true,
      fixedrange: false,
      domain: [0.3, 1],
      gridcolor: '#f3f4f6',
      showgrid: true
    },
    yaxis2: {
      title: 'Volume',
      autorange: true,
      fixedrange: false,
      domain: [0, 0.25],
      anchor: 'x',
      gridcolor: '#f3f4f6',
      showgrid: true
    },
    legend: {
      orientation: 'h',
      yanchor: 'bottom',
      y: -0.3,
      xanchor: 'center',
      x: 0.5,
      bgcolor: 'rgba(255, 255, 255, 0.8)',
      bordercolor: '#e5e7eb',
      borderwidth: 1
    },
    grid: {
      rows: 2,
      columns: 1,
      pattern: 'independent',
      roworder: 'top to bottom'
    },
    margin: { t: 60, l: 60, r: 40, b: 100 },
    hovermode: 'x unified',
    plot_bgcolor: '#ffffff',
    paper_bgcolor: '#ffffff'
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    toImageButtonOptions: {
      format: 'png',
      filename: 'candlestick_chart',
      height: 800,
      width: 1200,
      scale: 2
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '600px' }}>
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '600px' }}
        useResizeHandler={true}
      />
    </div>
  );
};

export default CandlestickDiagram;
