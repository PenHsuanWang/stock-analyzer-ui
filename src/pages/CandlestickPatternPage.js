// src/pages/CandlestickPatternPage.js
import React, { useState, useEffect } from 'react';
import BasePage from './BasePage';
import ListDatasetFromDBControls from '../components/containers/ListDatasetFromDBControls';
import CandlestickDiagram from '../components/charts/CandlestickDiagram';
import CandlestickPatternCheckbox from '../components/containers/CandlestickPatternCheckbox';
import { fetchDataFromBackendDB } from '../services/api';
import '../styles/CandlestickPatternPage.css'; 

function CandlestickPatternPage({ analyzedDataPrefix }) {
  const [visualizationData, setVisualizationData] = useState([]);
  const [selectedForVisualization, setSelectedForVisualization] = useState([]);
  const [availablePatterns, setAvailablePatterns] = useState([]);
  const [selectedPatterns, setSelectedPatterns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); 

  // Function to fetch data and extract patterns for the CandlestickDiagram
  const handleShowData = async () => {
    if (selectedForVisualization.length === 0) {
      setError('Please select at least one dataset to visualize');
      return;
    }

    setIsLoading(true);
    setError(null);

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
      setError(`Failed to load data: ${error.message}`);
      setVisualizationData([]);
    } finally {
      setIsLoading(false);
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
          {/* Page Header */}
          <div className="page-header">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Analysis</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Candlestick Pattern Visualization</span>
            </div>
            <h1 className="page-title">Candlestick Pattern Analysis</h1>
            <p className="page-description">
              Select stock datasets and pattern types to visualize candlestick charts with pattern recognition
            </p>
          </div>

          {/* Data Selection Section */}
          <div className="data-selection-container">
            <h2 className="section-title">1. Select Stock Datasets</h2>
            <ListDatasetFromDBControls
              prefix={analyzedDataPrefix}
              setSelectedItems={setSelectedForVisualization}
              className="list-dataset-controls"
            />
            <button 
              onClick={handleShowData} 
              className="show-data-button"
              disabled={isLoading || selectedForVisualization.length === 0}
              aria-label="Load selected datasets"
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Loading...
                </>
              ) : (
                'Show Chart'
              )}
            </button>
            <div className="selection-info">
              {selectedForVisualization.length > 0 && (
                <span className="info-badge">
                  {selectedForVisualization.length} dataset{selectedForVisualization.length > 1 ? 's' : ''} selected
                </span>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-container" role="alert">
              <span className="error-icon">⚠️</span>
              <span className="error-message">{error}</span>
              <button 
                className="error-close" 
                onClick={() => setError(null)}
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {/* Chart and Patterns Section */}
          <div className="chart-and-patterns-container">
            {visualizationData.length > 0 && (
              <>
                <div className="pattern-filter-section">
                  <h2 className="section-title">2. Filter Patterns</h2>
                  <CandlestickPatternCheckbox
                    patterns={availablePatterns}
                    selectedPatterns={selectedPatterns}
                    setSelectedPatterns={setSelectedPatterns}
                    className="pattern-checkbox-list"
                  />
                </div>
                
                <div className="candlestick-chart-container">
                  <h2 className="section-title">3. Chart Visualization</h2>
                  {isLoading ? (
                    <div className="loading-container">
                      <div className="spinner-large"></div>
                      <p>Loading chart data...</p>
                    </div>
                  ) : (
                    renderVisualization()
                  )}
                </div>
              </>
            )}
            
            {!isLoading && visualizationData.length === 0 && !error && (
              <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <h3>No Data Selected</h3>
                <p>Select stock datasets from the list above and click "Show Chart" to visualize candlestick patterns</p>
              </div>
            )}
          </div>
        </div>
      </BasePage>
    );
}

export default CandlestickPatternPage;
