// src/pages/AdvanceAnalyzedDataVisualizationPage.js
import React, { useState } from 'react';
import BasePage from './BasePage';
import ListDatasetFromDBControls from '../components/containers/ListDatasetFromDBControls';
import CandlestickDiagram from '../components/charts/CandlestickDiagram';
import MACDChart from '../components/charts/MACDChart';
import RSIChart from '../components/charts/RSIChart';
import IntegratedTechAnaChart from '../components/charts/IntegratedTechAnaChart'; // Import the new component
import { formatDate } from '../utils/DatetimeFormat';
import { fetchDataFromBackendDB } from '../services/api';
import '../styles/AdvanceAnalyzedDataVisualizationPage.css';

function AdvanceAnalyzedDataVisualizationPage({ analyzedDataPrefix }) {
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [candlestickData, setCandlestickData] = useState(null);
  const [macdData, setMacdData] = useState(null);
  const [rsiData, setRsiData] = useState(null);

// Function to handle the fetching and setting of data for visualization
const handleShowData = async () => {
  const fetchDataPromises = selectedDatasets.map(item =>
    fetchDataFromBackendDB({
      prefix: analyzedDataPrefix,
      stock_id: item.stock_id,
      start_date: item.start_date,
      end_date: item.end_date
    })
  );

  console.log(fetchDataPromises)

  try {
    const datasetsResponses = await Promise.all(fetchDataPromises);

    const transformedDatasets = datasetsResponses.map((response, index) => {
      if (!response || !Array.isArray(response.data)) {
        throw new Error('Response does not contain a data array');
      }
      // Reconstruct datetime based on start date from selectedDatasets
      const startDate = new Date(selectedDatasets[index].start_date);
      return response.data.map((dataPoint, valueIndex) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + valueIndex);
        return {
          ...dataPoint,
          Date: formatDate(date.toISOString()) // Format date to ensure consistency
        };
      });
    });

    // Combine all datasets into a single array sorted by date
    let combinedData = transformedDatasets.flat().sort((a, b) => new Date(a.Date) - new Date(b.Date));

    // Extracting individual datasets for each chart
    const candlestickData = combinedData.map(item => ({
      Date: item.Date,
      Open: item.Open,
      High: item.High,
      Low: item.Low,
      Close: item.Close,
      Volume: item.Volume
    }));

    const macdData = combinedData.map(item => ({
      Date: item.Date,
      MACD: item.MACD,
      signal: item.signal,
      histogram: item.histogram
    }));

    const rsiData = combinedData.map(item => ({
      Date: item.Date,
      RSI: item.RSI
    }));

    // Set the state for each chart's data
    setCandlestickData(candlestickData);
    setMacdData(macdData);
    setRsiData(rsiData);
  } catch (error) {
    console.error("Error fetching data:", error);
    setCandlestickData(null);
    setMacdData(null);
    setRsiData(null);
  }
};

  // Common layout settings for all charts
  const commonLayoutSettings = {
    autosize: true,
    margin: { t: 30, l: 50, r: 50, b: 50 },
    font: { family: 'Arial, sans-serif' },
    // Use 'grid' property to define the layout of multiple subplots
    grid: { rows: 2, columns: 1, pattern: 'independent' },
  };

  // Layout for the Candlestick chart
  const candlestickLayout = {
    ...commonLayoutSettings,
    title: 'Candlestick Chart',
    xaxis: {
      title: 'Date',
      type: 'date',
      domain: [0, 1] // Span the full width of the grid
    },
    yaxis: {
      title: 'Stock Price',
      autorange: true,
      domain: [0.5, 1] // Keep only the top half of the grid for the candlestick chart
    },
  };

  // Layout for the MACD chart
  const macdLayout = {
    ...commonLayoutSettings,
    title: 'MACD Chart',
    xaxis: {
      title: 'Date',
      type: 'date',
      domain: [0, 1] // Span the full width of the grid
    },
    yaxis: {
      title: 'Value',
      autorange: true,
      domain: [0, 0.5] // Use the bottom half of the grid for the MACD chart
    },
  };

  // Layout for the RSI chart
  const rsiLayout = {
    ...commonLayoutSettings,
    title: 'RSI Chart',
    xaxis: {
      title: 'Date',
      type: 'date',
      domain: [0, 0.5] // Use the bottom half of the grid, similar to MACD
    },
    yaxis: {
      title: 'RSI',
      autorange: true,
      domain: [0, 0.5], // Match the xaxis domain for alignment
      range: [0, 100] // RSI typically ranges from 0 to 100
    },
  };


  return (
    <BasePage>
      <ListDatasetFromDBControls
        prefix={analyzedDataPrefix}
        setSelectedItems={setSelectedDatasets}
      />
      <button onClick={handleShowData}>Show Data</button>
      <div className="advanced-analyzed-data-visualization-page-container">
        <div className="chart-container">
          {candlestickData && <CandlestickDiagram data={candlestickData} layout={candlestickLayout} />}
        </div>
        <div className="chart-container">
          {macdData && <MACDChart data={macdData} layout={macdLayout} />}
        </div>
        <div className="chart-container">
          {rsiData && <RSIChart data={rsiData} layout={rsiLayout} />}
        </div>
      </div>
    </BasePage>
  );

}

export default AdvanceAnalyzedDataVisualizationPage;
