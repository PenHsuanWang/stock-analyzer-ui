// src/pages/AdvanceAnalyzedDataVisualizationPage.js
import React, { useState } from 'react';
import BasePage from './BasePage';
import ListDatasetFromDBControls from '../components/containers/ListDatasetFromDBControls';
import CandlestickDiagram from '../components/charts/CandlestickDiagram';
import MACDChart from '../components/charts/MACDChart';
import RSIChart from '../components/charts/RSIChart';
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

    try {
      const datasetsResponses = await Promise.all(fetchDataPromises);
      const transformedCandlestickData = [];
      const transformedMacdData = [];
      const transformedRsiData = [];
      
      datasetsResponses.forEach((response, index) => {
        if (!response || !Array.isArray(response.data)) {
          throw new Error('Response does not contain a data array');
        }

        const data = response.data;
        const startDate = new Date(selectedDatasets[index].start_date);

        data.forEach((dataPoint, valueIndex) => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + valueIndex);
          const transformedDataPoint = {
            ...dataPoint,
            Date: date.toISOString().split('T')[0]
          };

          transformedCandlestickData.push(transformedDataPoint);
          
          if (transformedDataPoint.MACD !== undefined) {
            transformedMacdData.push(transformedDataPoint);
          }
          
          if (transformedDataPoint.RSI !== undefined) {
            transformedRsiData.push(transformedDataPoint);
          }
        });
      });

      setCandlestickData(transformedCandlestickData);
      setMacdData(transformedMacdData);
      setRsiData(transformedRsiData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setCandlestickData([]);
      setMacdData([]);
      setRsiData([]);
    }
  };

  return (
    <BasePage>
      <ListDatasetFromDBControls
        prefix={analyzedDataPrefix}
        setSelectedItems={setSelectedDatasets}
      />
      <button onClick={handleShowData}>Show Data</button>
      <div className="charts-container">
        {candlestickData && <CandlestickDiagram data={candlestickData} />}
        {macdData && <MACDChart data={macdData} />}
        {rsiData && <RSIChart data={rsiData} />}
      </div>
    </BasePage>
  );
}

export default AdvanceAnalyzedDataVisualizationPage;
