// src/pages/StockAnalysisDashboard.js
import React, { useState } from 'react';
import BasePage from './BasePage';
import ListDatasetFromDBControls from '../components/containers/ListDatasetFromDBControls';
import CandlestickPatternCheckbox from '../components/containers/CandlestickPatternCheckbox';
import CandlestickDiagram from '../components/charts/CandlestickDiagram';
import IntegratedTechnicalAnalysisChart from '../components/charts/IntegratedTechnicalAnalysisChart';
import { useStockDataFetcher } from '../hooks/useStockDataFetcher';
import { useCandlestickPatterns } from '../hooks/useCandlestickPatterns';
import '../styles/StockAnalysisDashboard.css';

const ANALYSIS_MODES = {
  QUICK_VIEW: 'quick_view',
  PATTERN_ANALYSIS: 'pattern_analysis',
  TECHNICAL_ANALYSIS: 'technical_analysis',
  MULTI_ASSET: 'multi_asset'
};

function StockAnalysisDashboard({ analyzedDataPrefix = 'stock_data' }) {
  // State management
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [analysisMode, setAnalysisMode] = useState(ANALYSIS_MODES.TECHNICAL_ANALYSIS);
  const [visualizationData, setVisualizationData] = useState([]);
  const [showIndicators, setShowIndicators] = useState({
    macd: true,
    rsi: true,
    movingAverages: true,
    volume: true
  });

  // Custom hooks
  const { fetchData, isLoading, error, setError } = useStockDataFetcher(analyzedDataPrefix);
  const {
    availablePatterns,
    selectedPatterns,
    setSelectedPatterns,
    extractPatterns,
    resetPatterns
  } = useCandlestickPatterns();

  // Handle data loading and analysis
  const handleAnalyzeData = async () => {
    if (selectedDatasets.length === 0) {
      setError('Please select at least one dataset to analyze');
      return;
    }

    const datasets = await fetchData(selectedDatasets);
    if (!datasets) return;

    // Extract patterns if in pattern or technical analysis mode
    if (analysisMode === ANALYSIS_MODES.PATTERN_ANALYSIS || 
        analysisMode === ANALYSIS_MODES.TECHNICAL_ANALYSIS) {
      extractPatterns(datasets);
    }

    // Transform data based on analysis mode
    const transformedData = transformDataForMode(datasets);
    setVisualizationData(transformedData);
  };

  // Transform data based on selected analysis mode
  const transformDataForMode = (datasets) => {
    switch (analysisMode) {
      case ANALYSIS_MODES.QUICK_VIEW:
      case ANALYSIS_MODES.MULTI_ASSET:
        return datasets;

      case ANALYSIS_MODES.PATTERN_ANALYSIS:
        return datasets;

      case ANALYSIS_MODES.TECHNICAL_ANALYSIS:
        return datasets.map((dataSet, index) => {
          const sortedData = dataSet.sort((a, b) => new Date(a.Date) - new Date(b.Date));
          
          const chartData = {
            stockInfo: dataSet[0]?._stockInfo || {
              stock_id: `Stock ${index + 1}`,
              start_date: sortedData[0]?.Date,
              end_date: sortedData[sortedData.length - 1]?.Date
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
            macd: showIndicators.macd ? sortedData.map(item => ({
              Date: item.Date,
              MACD: item.MACD,
              Signal_Line: item.Signal_Line,
              MACD_Histogram: item.MACD_Histogram
            })) : [],
            rsi: showIndicators.rsi ? sortedData.map(item => ({
              Date: item.Date,
              RSI: item.RSI
            })) : [],
            movingAverages: {}
          };

          // Extract moving averages dynamically if enabled
          if (showIndicators.movingAverages) {
            Object.keys(sortedData[0] || {}).forEach(key => {
              if (key.startsWith('MA_')) {
                chartData.movingAverages[key] = sortedData.map(item => ({
                  Date: item.Date,
                  value: item[key]
                }));
              }
            });
          }

          return chartData;
        });

      default:
        return datasets;
    }
  };

  // Handle mode change
  const handleModeChange = (newMode) => {
    setAnalysisMode(newMode);
    setVisualizationData([]);
    resetPatterns();
  };

  // Render visualization based on mode
  const renderVisualization = () => {
    if (visualizationData.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3>No Analysis Data</h3>
          <p>
            Select stock datasets from the list above and click "Analyze Data" to view
            {analysisMode === ANALYSIS_MODES.TECHNICAL_ANALYSIS && ' comprehensive technical analysis'}
            {analysisMode === ANALYSIS_MODES.PATTERN_ANALYSIS && ' candlestick patterns'}
            {analysisMode === ANALYSIS_MODES.QUICK_VIEW && ' stock price charts'}
            {analysisMode === ANALYSIS_MODES.MULTI_ASSET && ' multi-asset comparison'}
          </p>
        </div>
      );
    }

    switch (analysisMode) {
      case ANALYSIS_MODES.QUICK_VIEW:
      case ANALYSIS_MODES.MULTI_ASSET:
        return visualizationData.map((dataSet, index) => (
          <div key={index} className="chart-wrapper">
            <h3 className="chart-title">
              {dataSet[0]?._stockInfo?.stock_id || `Stock ${index + 1}`}
            </h3>
            <CandlestickDiagram data={dataSet} />
          </div>
        ));

      case ANALYSIS_MODES.PATTERN_ANALYSIS:
        return visualizationData.map((dataSet, index) => (
          <div key={index} className="chart-wrapper">
            <h3 className="chart-title">
              {dataSet[0]?._stockInfo?.stock_id || `Stock ${index + 1}`}
            </h3>
            <CandlestickDiagram 
              data={dataSet} 
              selectedPatterns={selectedPatterns}
            />
          </div>
        ));

      case ANALYSIS_MODES.TECHNICAL_ANALYSIS:
        return visualizationData.map((chartData, index) => (
          <div key={index} className="chart-wrapper">
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
        ));

      default:
        return null;
    }
  };

  const showPatternFilter = (analysisMode === ANALYSIS_MODES.PATTERN_ANALYSIS || 
                             analysisMode === ANALYSIS_MODES.TECHNICAL_ANALYSIS) && 
                            availablePatterns.length > 0;

  return (
    <BasePage>
      <div className="stock-analysis-dashboard">
        {/* Page Header */}
        <div className="page-header">
          <div className="breadcrumb">
            <span className="breadcrumb-item">Analysis</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-item active">Stock Analysis Dashboard</span>
          </div>
          <h1 className="page-title">Stock Analysis Dashboard</h1>
          <p className="page-description">
            Unified platform for comprehensive stock data analysis with candlestick charts, 
            pattern recognition, and technical indicators
          </p>
        </div>

        {/* Section 1: Data Selection */}
        <div className="dashboard-section">
          <h2 className="section-title">
            <span className="section-number">1</span>
            Select Stock Datasets
          </h2>
          <div className="data-selection-container">
            <ListDatasetFromDBControls
              prefix={analyzedDataPrefix}
              setSelectedItems={setSelectedDatasets}
              className="list-dataset-controls"
            />
            <div className="selection-info">
              {selectedDatasets.length > 0 && (
                <span className="info-badge">
                  {selectedDatasets.length} dataset{selectedDatasets.length > 1 ? 's' : ''} selected
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Analysis Mode Selection */}
        <div className="dashboard-section">
          <h2 className="section-title">
            <span className="section-number">2</span>
            Choose Analysis Mode
          </h2>
          <div className="mode-selector">
            <button
              className={`mode-button ${analysisMode === ANALYSIS_MODES.QUICK_VIEW ? 'active' : ''}`}
              onClick={() => handleModeChange(ANALYSIS_MODES.QUICK_VIEW)}
            >
              <span className="mode-icon">⚡</span>
              <span className="mode-label">Quick View</span>
              <span className="mode-desc">Basic candlestick charts</span>
            </button>
            <button
              className={`mode-button ${analysisMode === ANALYSIS_MODES.PATTERN_ANALYSIS ? 'active' : ''}`}
              onClick={() => handleModeChange(ANALYSIS_MODES.PATTERN_ANALYSIS)}
            >
              <span className="mode-icon">🎯</span>
              <span className="mode-label">Pattern Analysis</span>
              <span className="mode-desc">With pattern filtering</span>
            </button>
            <button
              className={`mode-button ${analysisMode === ANALYSIS_MODES.TECHNICAL_ANALYSIS ? 'active' : ''}`}
              onClick={() => handleModeChange(ANALYSIS_MODES.TECHNICAL_ANALYSIS)}
            >
              <span className="mode-icon">📈</span>
              <span className="mode-label">Technical Analysis</span>
              <span className="mode-desc">Indicators + Patterns</span>
            </button>
            <button
              className={`mode-button ${analysisMode === ANALYSIS_MODES.MULTI_ASSET ? 'active' : ''}`}
              onClick={() => handleModeChange(ANALYSIS_MODES.MULTI_ASSET)}
            >
              <span className="mode-icon">📊</span>
              <span className="mode-label">Multi-Asset</span>
              <span className="mode-desc">Compare multiple stocks</span>
            </button>
          </div>
        </div>

        {/* Section 3: Configuration Panel */}
        {analysisMode === ANALYSIS_MODES.TECHNICAL_ANALYSIS && (
          <div className="dashboard-section">
            <h2 className="section-title">
              <span className="section-number">3</span>
              Configure Indicators
            </h2>
            <div className="indicator-toggles">
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={showIndicators.macd}
                  onChange={(e) => setShowIndicators({...showIndicators, macd: e.target.checked})}
                />
                <span>MACD</span>
              </label>
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={showIndicators.rsi}
                  onChange={(e) => setShowIndicators({...showIndicators, rsi: e.target.checked})}
                />
                <span>RSI</span>
              </label>
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={showIndicators.movingAverages}
                  onChange={(e) => setShowIndicators({...showIndicators, movingAverages: e.target.checked})}
                />
                <span>Moving Averages</span>
              </label>
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={showIndicators.volume}
                  onChange={(e) => setShowIndicators({...showIndicators, volume: e.target.checked})}
                />
                <span>Volume</span>
              </label>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        <div className="dashboard-section">
          <button 
            onClick={handleAnalyzeData} 
            className="analyze-button"
            disabled={isLoading || selectedDatasets.length === 0}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                <span>🔍</span>
                Analyze Data
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-container" role="alert">
            <span className="error-icon">⚠️</span>
            <span className="error-message">{error}</span>
            <button 
              className="error-close" 
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}

        {/* Visualization Area */}
        <div className="visualization-container">
          {showPatternFilter && (
            <div className="pattern-filter-sidebar">
              <h2 className="section-title">
                <span className="section-number">{analysisMode === ANALYSIS_MODES.TECHNICAL_ANALYSIS ? '4' : '3'}</span>
                Filter Patterns
              </h2>
              <CandlestickPatternCheckbox
                patterns={availablePatterns}
                selectedPatterns={selectedPatterns}
                setSelectedPatterns={setSelectedPatterns}
              />
            </div>
          )}
          
          <div className={`charts-area ${showPatternFilter ? 'with-sidebar' : ''}`}>
            <h2 className="section-title">
              <span className="section-number">
                {showPatternFilter ? (analysisMode === ANALYSIS_MODES.TECHNICAL_ANALYSIS ? '5' : '4') : '3'}
              </span>
              Visualization
            </h2>
            {isLoading ? (
              <div className="loading-container">
                <div className="spinner-large"></div>
                <p>Loading chart data...</p>
              </div>
            ) : (
              renderVisualization()
            )}
          </div>
        </div>
      </div>
    </BasePage>
  );
}

export default StockAnalysisDashboard;
