// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage.js';
import DataCollectionPage from './pages/DataCollectionPage';
import DataAnalysisPage from './pages/DataAnalysisPage.js';
import DataExportPage from './pages/DataExportPage.js';
import AnalyzedDataVisualizationPage from './pages/AnalyzedDataVisualizationPage';
import StockAnalysisDashboard from './pages/StockAnalysisDashboard.js';
import CorrelationAnalysisPage from './pages/CorrelationAnalysisPage';
import ModelManagePage from './pages/ModelManagePage';
import ModelComparisonPage from './pages/ModelComparisonPage';
import ModelTrainingSetupPage from './pages/ModelTrainingSetupPage';
import TrainerControlPage from './pages/TrainerControlPage';
import JobSchedulerPage from './pages/JobSchedulerPage'; 

import CandlestickDiagram from './components/charts/CandlestickDiagram';

import ListDatasetFromDBControls from './components/containers/ListDatasetFromDBControls';
import StockSearchControls from './components/containers/StockSearchControls';
import DataCollectMiddlePanelControls from './components/containers/DataCollectMiddlePanelControls';

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          } 
        />

        <Route 
          path="/data-collect" 
          element={
            <MainLayout>
              <DataCollectionPage 
                StockSearchControlsComponent={StockSearchControls}
                CandlestickDiagramComponent={CandlestickDiagram}
                MiddlePanelComponent={DataCollectMiddlePanelControls}
                SavedDataListComponent={ListDatasetFromDBControls}
                prefix="stock_data"
              />
            </MainLayout>
          }
        />

        <Route 
          path="/data-analysis" 
          element={
            <MainLayout>
              <DataAnalysisPage 
                savedDataPrefix="raw_stock_data"
                analyzedDataPrefix="stock_data"
              />
            </MainLayout>
          }
        />

        {/* Unified Stock Analysis Dashboard */}
        <Route 
          path="/stock-analysis-dashboard" 
          element={
            <MainLayout>
              <StockAnalysisDashboard 
                analyzedDataPrefix="stock_data" 
              />
            </MainLayout>
          } 
        />

        {/* Redirect old routes to unified dashboard */}
        <Route 
          path="/analyzed-visualization-candlestick-technical-analysis" 
          element={<Navigate to="/stock-analysis-dashboard" replace />}
        />

        <Route 
          path="/analyzed-visualization-candlestick-with-pattern" 
          element={<Navigate to="/stock-analysis-dashboard" replace />}
        />

        <Route 
          path="/analyzed-visualization-candlestick" 
          element={<Navigate to="/stock-analysis-dashboard" replace />}
        />
        
        <Route 
          path="/analyzed-visualization-heatmap" 
          element={
            <MainLayout>
              <AnalyzedDataVisualizationPage 
                analyzedDataPrefix="stock_data" 
                chartType="heatmap" 
              />
            </MainLayout>
          } 
        />

        <Route 
          path="/analyzed-visualization-histogram" 
          element={
            <MainLayout>
              <AnalyzedDataVisualizationPage 
                analyzedDataPrefix="stock_data" 
                chartType="histogram" 
              />
            </MainLayout>
          } 
        />

        <Route 
          path="/analyzed-visualization-pairgrid" 
          element={
            <MainLayout>
              <AnalyzedDataVisualizationPage 
                analyzedDataPrefix="stock_data" 
                chartType="pairgrid" 
              />
            </MainLayout>
          } 
        />

        <Route
          path="/advance-analyzed-visualization" 
          element={<Navigate to="/stock-analysis-dashboard" replace />}
        />
        
        <Route 
          path="/correlation-analysis" 
          element={
            <MainLayout>
              <CorrelationAnalysisPage
                prefix="stock_data"
              />
            </MainLayout>
          }
        />

        <Route 
          path="/data-export" 
          element={
            <MainLayout>
              <DataExportPage/>
            </MainLayout>
          }
        />

        <Route 
          path="/model-manage" 
          element={
            <MainLayout>
              <ModelManagePage />
            </MainLayout>
          }
        />

        <Route 
          path="/model-comparison" 
          element={
            <MainLayout>
              <ModelComparisonPage />
            </MainLayout>
          }  
        />

        <Route
          path="/model-training-setup"
          element={
            <MainLayout>
              <ModelTrainingSetupPage 
                analyzedDataPrefix="stock_data"
              />
            </MainLayout>
          }
        />

        <Route 
          path="/trainer-control"
          element={
            <MainLayout>
              <TrainerControlPage 
                analyzedDataPrefix="stock_data"
              />
            </MainLayout>
          }
        />

        <Route 
          path="/job-scheduler" 
          element={
            <MainLayout>
              <JobSchedulerPage />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;