// src/pages/DevMACDVisualizationPage.js
import React, { useState } from 'react';
import BasePage from './BasePage';
import ListDatasetFromDBControls from '../components/containers/ListDatasetFromDBControls';
import IntegratedTechAnaChart from '../components/charts/IntegratedTechAnaChart';
import { formatDate } from '../utils/DatetimeFormat';
import { fetchDataFromBackendDB } from '../services/api';
import '../styles/AdvanceAnalyzedDataVisualizationPage.css'; // Keep the CSS path as is

function DevMACDVisualizationPage({ analyzedDataPrefix }) {
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [candlestickData, setCandlestickData] = useState(null);
  const [macdData, setMacdData] = useState(null);
  const [rsiData, setRsiData] = useState(null);
  const [xAxisRange, setXAxisRange] = useState(null);

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

    console.log(fetchDataPromises);

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
        Signal_Line: item.Signal_Line,
        MACD_Histogram: item.MACD_Histogram
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

  const handleRelayout = (event) => {
    if (event['xaxis.range[0]'] && event['xaxis.range[1]']) {
      setXAxisRange([event['xaxis.range[0]'], event['xaxis.range[1]']]);
    }
  };

  // The rest of the component remains unchanged, using the same layouts and structure

  return (
    <BasePage>
      <ListDatasetFromDBControls
        prefix={analyzedDataPrefix}
        setSelectedItems={setSelectedDatasets}
      />
      <button onClick={handleShowData}>Show Data</button>
      <div className="advanced-analyzed-data-visualization-page-container">
        {candlestickData && macdData && rsiData && (
          <div className="chart-container">
            <IntegratedTechAnaChart
              candlestickData={candlestickData}
              macdData={macdData}
              rsiData={rsiData}
            />
          </div>
        )}
      </div>
    </BasePage>
  );
  // return (
  //   <BasePage>
  //     <ListDatasetFromDBControls
  //       prefix={analyzedDataPrefix}
  //       setSelectedItems={setSelectedDatasets}
  //     />
  //     <button onClick={handleShowData}>Show Data</button>
  //     <div className="advanced-analyzed-data-visualization-page-container">
  //       {macdData && (
  //         <div className="chart-container">
  //           <MACDChart macdData={macdData} />
  //         </div>
  //       )}
  //     </div>
  //   </BasePage>
  // );
}

export default DevMACDVisualizationPage;
