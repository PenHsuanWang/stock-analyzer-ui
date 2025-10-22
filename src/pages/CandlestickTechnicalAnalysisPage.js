// src/pages/CandlestickTechnicalAnalysisPage.js
import React, { useState } from 'react';
import BasePage from './BasePage';
import ListDatasetFromDBControls from '../components/containers/ListDatasetFromDBControls';
import CandlestickPatternCheckbox from '../components/containers/CandlestickPatternCheckbox';
import IntegratedTechnicalAnalysisChart from '../components/charts/IntegratedTechnicalAnalysisChart';
import { fetchDataFromBackendDB } from '../services/api';
import '../styles/CandlestickTechnicalAnalysisPage.css';

function CandlestickTechnicalAnalysisPage({ analyzedDataPrefix }) {
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [visualizationData, setVisualizationData] = useState([]);
  const [availablePatterns, setAvailablePatterns] = useState([]);
  const [selectedPatterns, setSelectedPatterns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Extract unique patterns from datasets
  const extractPatterns = (dataSets) => {
    const patternsSet = new Set(
      dataSets.flatMap(dataSet => 
        dataSet.map(item => item.Pattern).filter(Boolean)
      )
    );
    return Array.from(patternsSet);
  };

  // Function to fetch and process data for visualization
  const handleShowData = async () => {
    if (selectedDatasets.length === 0) {
      setError('Please select at least one dataset to visualize');
      return;
    }

    setIsLoading(true);
    setError(null);

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

      const transformedDatasets = datasetsResponses.map((response, index) => {
        if (!response || !Array.isArray(response.data)) {
          throw new Error('Response does not contain a data array');
        }
        
        const startDate = new Date(selectedDatasets[index].start_date);
        return response.data.map((dataPoint, valueIndex) => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + valueIndex);
          return {
            ...dataPoint,
            Date: date.toISOString().split('T')[0]
          };
        });
      });

      // Extract patterns
      const patterns = extractPatterns(transformedDatasets);
      setAvailablePatterns(patterns);

      // Prepare data structure for each dataset separately
      const chartsData = transformedDatasets.map((dataSet, index) => {
        const sortedData = dataSet.sort((a, b) => new Date(a.Date) - new Date(b.Date));
        
        const chartData = {
          stockInfo: {
            stock_id: selectedDatasets[index].stock_id,
            start_date: selectedDatasets[index].start_date,
            end_date: selectedDatasets[index].end_date
          },
          candlestick: sortedData.map(item => ({
            Date: item.Date,
            Open: item.Open,
            High: item.High,
            Low: item.Low,
            Close: item.Close,
            Volume: item.Volume,
            Pattern: item.Pattern
          })),
          macd: sortedData.map(item => ({
            Date: item.Date,
            MACD: item.MACD,
            Signal_Line: item.Signal_Line,
            MACD_Histogram: item.MACD_Histogram
          })),
          rsi: sortedData.map(item => ({
            Date: item.Date,
            RSI: item.RSI
          })),
          movingAverages: {}
        };

        // Extract moving averages dynamically
        Object.keys(sortedData[0] || {}).forEach(key => {
          if (key.startsWith('MA_')) {
            chartData.movingAverages[key] = sortedData.map(item => ({
              Date: item.Date,
              value: item[key]
            }));
          }
        });

        return chartData;
      });

      setVisualizationData(chartsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(`Failed to load data: ${error.message}`);
      setVisualizationData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BasePage>
      <div className="candlestick-technical-analysis-page-container">
        {/* Page Header */}
        <div className="page-header">
          <div className="breadcrumb">
            <span className="breadcrumb-item">Analysis</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-item active">Technical Analysis with Patterns</span>
          </div>
          <h1 className="page-title">Candlestick Technical Analysis</h1>
          <p className="page-description">
            Comprehensive stock analysis combining candlestick patterns, MACD, RSI, and moving averages
          </p>
        </div>

        {/* Data Selection Section */}
        <div className="data-selection-container">
          <h2 className="section-title">1. Select Stock Datasets</h2>
          <ListDatasetFromDBControls
            prefix={analyzedDataPrefix}
            setSelectedItems={setSelectedDatasets}
            className="list-dataset-controls"
          />
          <button 
            onClick={handleShowData} 
            className="show-data-button"
            disabled={isLoading || selectedDatasets.length === 0}
            aria-label="Load selected datasets"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              'Analyze Data'
            )}
          </button>
          <div className="selection-info">
            {selectedDatasets.length > 0 && (
              <span className="info-badge">
                {selectedDatasets.length} dataset{selectedDatasets.length > 1 ? 's' : ''} selected
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

        {/* Chart and Pattern Filter Section */}
        {visualizationData && visualizationData.length > 0 && (
          <div className="analysis-content-container">
            {/* Pattern Filter Sidebar */}
            {availablePatterns.length > 0 && (
              <div className="pattern-filter-section">
                <h2 className="section-title">2. Filter Patterns</h2>
                <CandlestickPatternCheckbox
                  patterns={availablePatterns}
                  selectedPatterns={selectedPatterns}
                  setSelectedPatterns={setSelectedPatterns}
                  className="pattern-checkbox-list"
                />
              </div>
            )}

            {/* Main Chart Area */}
            <div className="chart-section">
              <h2 className="section-title">
                {availablePatterns.length > 0 ? '3. Technical Analysis Chart' : '2. Technical Analysis Chart'}
              </h2>
              {isLoading ? (
                <div className="loading-container">
                  <div className="spinner-large"></div>
                  <p>Loading chart data...</p>
                </div>
              ) : (
                visualizationData.map((chartData, index) => (
                  <div key={index} className="individual-chart-container">
                    {chartData.stockInfo && (
                      <h3 className="chart-title">
                        {chartData.stockInfo.stock_id} ({chartData.stockInfo.start_date} to {chartData.stockInfo.end_date})
                      </h3>
                    )}
                    <IntegratedTechnicalAnalysisChart
                      data={chartData}
                      selectedPatterns={selectedPatterns}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!visualizationData || visualizationData.length === 0) && !error && (
          <div className="empty-state">
            <div className="empty-state-icon">📈</div>
            <h3>No Analysis Data</h3>
            <p>
              Select stock datasets from the list above and click "Analyze Data" to view comprehensive 
              technical analysis including candlestick patterns, MACD, RSI, and moving averages
            </p>
          </div>
        )}
      </div>
    </BasePage>
  );
}

export default CandlestickTechnicalAnalysisPage;
