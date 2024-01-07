import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.js';
import BasePage from './pages/BasePage.js';
import DataCollectionPage from './pages/DataCollectionPage';
import DataExportPage from './pages/DataExportPage.js';
import AnalyzedDataVisualizationPage from './pages/AnalyzedDataVisualizationPage';
import CandlestickPatternPage from './pages/CandlestickPatternPage.js';
import CorrelationAnalysisPage from './pages/CorrelationAnalysisPage';

import CandlestickDiagram from './components/charts/CandlestickDiagram';

import ListDatasetFromDBControls from './components/containers/ListDatasetFromDBControls';
import StockSearchControls from './components/containers/StockSearchControls';
import DataCollectMiddlePanelControls from './components/containers/DataCollectMiddlePanelControls';

import './styles/BasePage.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route 
          path="/data-collect" 
          element={
            <DataCollectionPage 
              StockSearchControlsComponent={StockSearchControls}
              CandlestickDiagramComponent={CandlestickDiagram}
              MiddlePanelComponent={DataCollectMiddlePanelControls}
              SavedDataListComponent={ListDatasetFromDBControls}
              prefix="stock_data"
            />
          }
        />

        <Route 
          path="/analyzed-visualization-candlestick-with-pattern" 
          element={
            <CandlestickPatternPage 
              analyzedDataPrefix="stock_data" 
            />
          } 
        />

        <Route 
          path="/analyzed-visualization-candlestick" 
          element={
            <AnalyzedDataVisualizationPage 
              analyzedDataPrefix="stock_data" 
              chartType="candlestick" 
            />
          } 
        />
        
        <Route 
          path="/analyzed-visualization-heatmap" 
          element={
            <AnalyzedDataVisualizationPage 
              analyzedDataPrefix="stock_data" 
              chartType="heatmap" 
            />
          } 
        />

        <Route 
          path="/analyzed-visualization-histogram" 
          element={
            <AnalyzedDataVisualizationPage 
              analyzedDataPrefix="stock_data" 
              chartType="histogram" 
            />
          } 
        />

        <Route 
          path="/analyzed-visualization-pairgrid" 
          element={
            <AnalyzedDataVisualizationPage 
              analyzedDataPrefix="stock_data" 
              chartType="pairgrid" 
            />
          } 
        />
        
        <Route 
          path="/correlation-analysis" 
          element={
            <CorrelationAnalysisPage
              prefix="stock_data"
            />
          }
        />

        <Route 
          path="/data-export" 
          element={
            <DataExportPage/>
          }
        />

        <Route path="/base" element={<BasePage />} />
      </Routes>
    </Router>
  );
}

export default App;