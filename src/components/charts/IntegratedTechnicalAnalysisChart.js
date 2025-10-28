// src/components/charts/IntegratedTechnicalAnalysisChart.js
import React from 'react';
import Plot from 'react-plotly.js';

const IntegratedTechnicalAnalysisChart = ({ data, selectedPatterns = [] }) => {
  if (!data || !data.candlestick || data.candlestick.length === 0) {
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

  const { candlestick, macd, rsi, movingAverages } = data;

  // Initialize plot data array
  const plotData = [];

  // === CANDLESTICK SERIES ===
  const candlestickSeries = {
    x: candlestick.map(item => item.Date),
    close: candlestick.map(item => item.Close),
    high: candlestick.map(item => item.High),
    low: candlestick.map(item => item.Low),
    open: candlestick.map(item => item.Open),
    increasing: { line: { color: '#10b981' } },
    decreasing: { line: { color: '#ef4444' } },
    type: 'candlestick',
    name: 'Price',
    xaxis: 'x',
    yaxis: 'y'
  };
  plotData.push(candlestickSeries);

  // === VOLUME SERIES ===
  const volumeSeries = {
    x: candlestick.map(item => item.Date),
    y: candlestick.map(item => item.Volume),
    type: 'bar',
    name: 'Volume',
    marker: {
      color: candlestick.map((item, i) => {
        if (i === 0) return '#94a3b8';
        return item.Close >= candlestick[i-1].Close 
          ? 'rgba(16, 185, 129, 0.5)' 
          : 'rgba(239, 68, 68, 0.5)';
      })
    },
    xaxis: 'x',
    yaxis: 'y2',
    showlegend: false
  };
  plotData.push(volumeSeries);

  // === MOVING AVERAGES ===
  const maColors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#6366f1'];
  let colorIndex = 0;

  Object.entries(movingAverages || {}).forEach(([key, values]) => {
    plotData.push({
      x: values.map(item => item.Date),
      y: values.map(item => item.value),
      type: 'scatter',
      mode: 'lines',
      name: key,
      line: { 
        color: maColors[colorIndex % maColors.length],
        width: 2
      },
      xaxis: 'x',
      yaxis: 'y'
    });
    colorIndex++;
  });

  // === PATTERN MARKERS ===
  if (selectedPatterns && selectedPatterns.length > 0) {
    const patternColors = [
      '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
      '#ec4899', '#f97316', '#14b8a6', '#6366f1', '#84cc16'
    ];

    const patternData = {};

    candlestick.forEach(item => {
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
            xaxis: 'x',
            yaxis: 'y',
            hovertemplate: `<b>${item.Pattern}</b><br>Date: %{x}<br>Price: $%{y:.2f}<extra></extra>`
          };
        }
        patternData[item.Pattern].x.push(item.Date);
        patternData[item.Pattern].y.push(item.Close);
      }
    });

    Object.values(patternData).forEach(series => plotData.push(series));
  }

  // === MACD SERIES ===
  if (macd && macd.length > 0) {
    // MACD Line
    plotData.push({
      x: macd.map(item => item.Date),
      y: macd.map(item => item.MACD),
      type: 'scatter',
      mode: 'lines',
      name: 'MACD',
      line: { color: '#3b82f6', width: 2 },
      xaxis: 'x',
      yaxis: 'y3'
    });

    // Signal Line
    plotData.push({
      x: macd.map(item => item.Date),
      y: macd.map(item => item.Signal_Line),
      type: 'scatter',
      mode: 'lines',
      name: 'Signal',
      line: { color: '#f59e0b', width: 2 },
      xaxis: 'x',
      yaxis: 'y3'
    });

    // MACD Histogram
    plotData.push({
      x: macd.map(item => item.Date),
      y: macd.map(item => Number(item.MACD_Histogram) || 0),
      type: 'bar',
      name: 'Histogram',
      marker: {
        color: macd.map(item =>
          (item.MACD_Histogram >= 0 ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)')
        )
      },
      xaxis: 'x',
      yaxis: 'y3'
    });
  }

  // === RSI SERIES ===
  if (rsi && rsi.length > 0) {
    // RSI Line
    plotData.push({
      x: rsi.map(item => item.Date),
      y: rsi.map(item => item.RSI),
      type: 'scatter',
      mode: 'lines',
      name: 'RSI',
      line: { color: '#8b5cf6', width: 2 },
      xaxis: 'x',
      yaxis: 'y4'
    });

    // Overbought line (70)
    plotData.push({
      x: rsi.map(item => item.Date),
      y: new Array(rsi.length).fill(70),
      type: 'scatter',
      mode: 'lines',
      name: 'Overbought',
      line: { color: '#ef4444', dash: 'dash', width: 1 },
      xaxis: 'x',
      yaxis: 'y4',
      showlegend: false
    });

    // Oversold line (30)
    plotData.push({
      x: rsi.map(item => item.Date),
      y: new Array(rsi.length).fill(30),
      type: 'scatter',
      mode: 'lines',
      name: 'Oversold',
      line: { color: '#10b981', dash: 'dash', width: 1 },
      xaxis: 'x',
      yaxis: 'y4',
      showlegend: false
    });
  }

  // === LAYOUT CONFIGURATION ===
  const layout = {
    autosize: true,
    title: {
      text: 'Integrated Technical Analysis with Pattern Recognition',
      font: { size: 18, weight: 600, color: '#111827' }
    },
    xaxis: {
      title: 'Date',
      type: 'date',
      domain: [0, 1],
      rangeslider: {
        visible: true,
        borderwidth: 1,
        bordercolor: '#e5e7eb',
        thickness: 0.10,
        bgcolor: '#f3f4f6'
      },
      rangeselector: {
        buttons: [
          { count: 1, label: '1M', step: 'month', stepmode: 'backward' },
          { count: 3, label: '3M', step: 'month', stepmode: 'backward' },
          { count: 6, label: '6M', step: 'month', stepmode: 'backward' },
          { step: 'all', label: 'All' }
        ],
        bgcolor: '#ffffff',
        activecolor: '#667eea',
        font: { size: 11 }
      },
      gridcolor: '#f3f4f6',
      showgrid: true
    },
    // Price (Candlestick) Axis
    yaxis: {
      title: { text: 'Price ($)', font: { size: 12, color: '#4b5563' } },
      domain: [0.50, 0.88],
      gridcolor: '#f3f4f6',
      showgrid: true,
      autorange: true,
      fixedrange: false
    },
    // Volume Axis
    yaxis2: {
      title: { text: 'Volume', font: { size: 11, color: '#6b7280' } },
      domain: [0.42, 0.50],
      anchor: 'x',
      gridcolor: '#f3f4f6',
      showgrid: false
    },
    // MACD Axis
    yaxis3: {
      title: { text: 'MACD', font: { size: 11, color: '#6b7280' } },
      domain: [0.21, 0.38],
      anchor: 'x',
      gridcolor: '#f3f4f6',
      showgrid: true,
      zeroline: true,
      zerolinecolor: '#9ca3af',
      zerolinewidth: 1
    },
    // RSI Axis
    yaxis4: {
      title: { text: 'RSI', font: { size: 11, color: '#6b7280' } },
      domain: [0.05, 0.18],
      anchor: 'x',
      gridcolor: '#f3f4f6',
      showgrid: true,
      range: [0, 100]
    },
    legend: {
      orientation: 'h',
      yanchor: 'bottom',
      y: -0.15,
      xanchor: 'center',
      x: 0.5,
      bgcolor: 'rgba(255, 255, 255, 0.9)',
      bordercolor: '#e5e7eb',
      borderwidth: 1,
      font: { size: 11 }
    },
    margin: { t: 60, l: 60, r: 60, b: 120 },
    hovermode: 'x unified',
    plot_bgcolor: '#ffffff',
    paper_bgcolor: '#ffffff',
    barmode: 'overlay'
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    toImageButtonOptions: {
      format: 'png',
      filename: 'technical_analysis_chart',
      height: 1000,
      width: 1400,
      scale: 2
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '800px' }}>
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '800px' }}
        useResizeHandler={true}
      />
    </div>
  );
};

export default IntegratedTechnicalAnalysisChart;
