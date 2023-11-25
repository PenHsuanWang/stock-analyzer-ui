// src/pages/CandlestickPatternPage.js
import React, { useState, useEffect } from 'react';
import BasePage from './BasePage';
import ListDatasetFromDBControls from '../components/containers/ListDatasetFromDBControls';
import CandlestickDiagram from '../components/charts/CandlestickDiagram';
import CandlestickPatternCheckbox from '../components/containers/CandlestickPatternCheckbox'; // 引入新的 Checkbox 組件
import { fetchDataFromBackendDB } from '../services/api';
import '../styles/CandlestickPatternPage.css'; 

function CandlestickPatternPage({ analyzedDataPrefix }) {
  const [visualizationData, setVisualizationData] = useState([]);
  const [selectedForVisualization, setSelectedForVisualization] = useState([]);
  const [availablePatterns, setAvailablePatterns] = useState([]);
  const [selectedPatterns, setSelectedPatterns] = useState([]); 

  // Function to fetch data and extract patterns for the CandlestickDiagram
  const handleShowData = async () => {
    const promises = selectedForVisualization.map(item =>
        fetchDataFromBackendDB({
          prefix: analyzedDataPrefix,
          stock_id: item.stock_id,
          start_date: item.start_date,
          end_date: item.end_date
        })
    );

      try {
        const datasets = await Promise.all(promises);
        const transformedDatasets = datasets.map((response, index) => {
          if (!response || !Array.isArray(response.data)) {
            throw new Error('Response does not contain a data array');
          }
          const data = response.data;
          const startDate = new Date(selectedForVisualization[index].start_date);
          return data.map((dataPoint, valueIndex) => {
            const date = new Date(startDate);
            date.setDate(date.getDate() + valueIndex);
            return {
              ...dataPoint,
              Date: date.toISOString().split('T')[0]
            };
          });
        });

        const patterns = extractPatterns(transformedDatasets);
        setAvailablePatterns(patterns);

        setVisualizationData(transformedDatasets);
        } catch (error) {
        console.error("Error fetching candlestick data:", error);
        setVisualizationData([]);
      }
    };

    const extractPatterns = (dataSets) => {
      const patternsSet = new Set(
        dataSets.flatMap(dataSet => 
          dataSet.map(item => item.Pattern).filter(Boolean) // extract the pattern from data and filter out the na
        )
      );
      return Array.from(patternsSet); // convert to set
    };
      

      // Render the appropriate chart based on chartType
    const renderVisualization = () => {
      return visualizationData.map((dataSet, index) => (
        <CandlestickDiagram key={index} data={dataSet} selectedPatterns={selectedPatterns} />
      ));
    };


    return (
      <BasePage>
        <div className="candlestick-pattern-page-container">
          <div className="data-selection-container">
            <ListDatasetFromDBControls
              prefix={analyzedDataPrefix}
              setSelectedItems={setSelectedForVisualization}
              className="list-dataset-controls"
            />
            <button onClick={handleShowData} className="show-data-button">Show</button>
          </div>
          <div className="chart-and-patterns-container">
            <CandlestickPatternCheckbox
              patterns={availablePatterns}
              selectedPatterns={selectedPatterns}
              setSelectedPatterns={setSelectedPatterns}
              className="pattern-checkbox-list"
            />
            <div className="candlestick-chart-container">
              {selectedForVisualization.length > 0 ? renderVisualization() : <p>stock dataset not selected</p>}
            </div>
          </div>
        </div>
      </BasePage>
    );
}

export default CandlestickPatternPage;
