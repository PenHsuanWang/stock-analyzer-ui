// src/pages/StockAnalysisDashboard.js
import React, { useState } from 'react';
import SplitPane from '../components/basic/SplitPane';
import ResponsiveChartContainer from '../components/charts/ResponsiveChartContainer';
import EmptyState from '../components/basic/EmptyState';
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
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [analysisMode, setAnalysisMode] = useState(ANALYSIS_MODES.TECHNICAL_ANALYSIS);
  const [visualizationData, setVisualizationData] = useState([]);
  const [showIndicators, setShowIndicators] = useState({
    macd: true,
    rsi: true,
    movingAverages: true,
    volume: true
  });

  const { fetchData, isLoading, error, setError } = useStockDataFetcher(analyzedDataPrefix);
  const {
    availablePatterns,
    selectedPatterns,
    setSelectedPatterns,
    extractPatterns,
    resetPatterns
  } = useCandlestickPatterns();

  const handleAnalyzeData = async () => {
    if (selectedDatasets.length === 0) {
      setError('Please select at least one dataset to analyze');
      return;
    }

    const datasets = await fetchData(selectedDatasets);
    if (!datasets) return;

    if (analysisMode === ANALYSIS_MODES.PATTERN_ANALYSIS || 
        analysisMode === ANALYSIS_MODES.TECHNICAL_ANALYSIS) {
      extractPatterns(datasets);
    }

    const transformedData = transformDataForMode(datasets);
    setVisualizationData(transformedData);
  };

  const transformDataForMode = (datasets) => {
    switch (analysisMode) {
      case ANALYSIS_MODES.QUICK_VIEW:
      case ANALYSIS_MODES.MULTI_ASSET:
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

  const handleModeChange = (newMode) => {
    setAnalysisMode(newMode);
    setVisualizationData([]);
    resetPatterns();
  };

  const renderVisualization = () => {
    if (visualizationData.length === 0) {
      return (
        <EmptyState 
          icon="📊"
          title="No Analysis Data"
          description="Select stock datasets and click 'Analyze Data' to view charts."
        />
      );
    }

    // Common renderer for charts wrapped in ResponsiveChartContainer
    const renderChart = (title, chartComponent) => (
      <div className="chart-wrapper">
        <h3 className="chart-title">{title}</h3>
        <ResponsiveChartContainer minHeight={500}>
          {chartComponent}
        </ResponsiveChartContainer>
      </div>
    );

    switch (analysisMode) {
      case ANALYSIS_MODES.QUICK_VIEW:
      case ANALYSIS_MODES.MULTI_ASSET:
        return visualizationData.map((dataSet, index) => (
          renderChart(
            dataSet[0]?._stockInfo?.stock_id || `Stock ${index + 1}`,
            <CandlestickDiagram data={dataSet} />
          )
        ));

      case ANALYSIS_MODES.PATTERN_ANALYSIS:
        return visualizationData.map((dataSet, index) => (
          renderChart(
            dataSet[0]?._stockInfo?.stock_id || `Stock ${index + 1}`,
            <CandlestickDiagram 
              data={dataSet} 
              selectedPatterns={selectedPatterns}
            />
          )
        ));

      case ANALYSIS_MODES.TECHNICAL_ANALYSIS:
        return visualizationData.map((chartData, index) => (
          renderChart(
            chartData.stockInfo ? `${chartData.stockInfo.stock_id} (${chartData.stockInfo.start_date} to ${chartData.stockInfo.end_date})` : `Stock ${index+1}`,
            <IntegratedTechnicalAnalysisChart
              data={chartData}
              selectedPatterns={selectedPatterns}
            />
          )
        ));

      default:
        return null;
    }
  };

  const showPatternFilter = (analysisMode === ANALYSIS_MODES.PATTERN_ANALYSIS || 
                             analysisMode === ANALYSIS_MODES.TECHNICAL_ANALYSIS) && 
                            availablePatterns.length > 0;

  const leftPane = (
    <div className="control-deck">
      <section className="control-section">
        <h3 className="control-section__title">Analysis Mode</h3>
        <div className="mode-selector">
          <button
            className={`mode-button ${analysisMode === ANALYSIS_MODES.QUICK_VIEW ? 'active' : ''}`}
            onClick={() => handleModeChange(ANALYSIS_MODES.QUICK_VIEW)}
          >
            <span className="mode-icon">⚡</span>
            <span className="mode-label">Quick View</span>
          </button>
          <button
            className={`mode-button ${analysisMode === ANALYSIS_MODES.PATTERN_ANALYSIS ? 'active' : ''}`}
            onClick={() => handleModeChange(ANALYSIS_MODES.PATTERN_ANALYSIS)}
          >
            <span className="mode-icon">🎯</span>
            <span className="mode-label">Patterns</span>
          </button>
          <button
            className={`mode-button ${analysisMode === ANALYSIS_MODES.TECHNICAL_ANALYSIS ? 'active' : ''}`}
            onClick={() => handleModeChange(ANALYSIS_MODES.TECHNICAL_ANALYSIS)}
          >
            <span className="mode-icon">📈</span>
            <span className="mode-label">Technical</span>
          </button>
          <button
            className={`mode-button ${analysisMode === ANALYSIS_MODES.MULTI_ASSET ? 'active' : ''}`}
            onClick={() => handleModeChange(ANALYSIS_MODES.MULTI_ASSET)}
          >
            <span className="mode-icon">📊</span>
            <span className="mode-label">Multi-Asset</span>
          </button>
        </div>
      </section>

      <section className="control-section control-section--scrollable">
        <h3 className="control-section__title">Select Datasets</h3>
        <ListDatasetFromDBControls
          prefix={analyzedDataPrefix}
          setSelectedItems={setSelectedDatasets}
          className="list-dataset-controls"
          compact={true}
        />
      </section>

      {analysisMode === ANALYSIS_MODES.TECHNICAL_ANALYSIS && (
        <section className="control-section">
          <h3 className="control-section__title">Indicators</h3>
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
          </div>
        </section>
      )}

      {showPatternFilter && (
        <section className="control-section">
          <h3 className="control-section__title">Patterns</h3>
          <CandlestickPatternCheckbox
            patterns={availablePatterns}
            selectedPatterns={selectedPatterns}
            setSelectedPatterns={setSelectedPatterns}
          />
        </section>
      )}

      <div className="control-section">
        <button 
          onClick={handleAnalyzeData} 
          className="analyze-button"
          disabled={isLoading || selectedDatasets.length === 0}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Data'}
        </button>
        {error && (
          <div style={{ color: 'var(--danger)', marginTop: 'var(--s-2)', fontSize: 'var(--font-size-sm)' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );

  const rightPane = (
    <div className="visual-deck">
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--s-10)' }}>
           Loading...
        </div>
      ) : (
        renderVisualization()
      )}
    </div>
  );

  return (
    <SplitPane 
      left={leftPane} 
      right={rightPane} 
      leftWidth="340px"
    />
  );
}

export default StockAnalysisDashboard;