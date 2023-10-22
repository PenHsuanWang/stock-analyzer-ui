import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.js';
import BasePage from './pages/BasePage.js';
import DataVisualizationPage from './pages/DataVisualizationPage';
import DataCollectionPage from './pages/DataCollectionPage';

import StockDiagram from './components/charts/StockDiagram';
import TwoDHeatmapDiagram from './components/charts/TwoDHeatmapDiagram';

import DatasetFromListControls from './components/containers/ListDatasetFromDBControls';
import StockSearchControls from './components/containers/StockSearchControls';
import DataCollectMiddlePanelControls from './components/containers/DataCollectMiddlePanelControls';

import './styles/BasePage.css';
import ListDatasetFromDBControls from './components/containers/ListDatasetFromDBControls';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        <Route 
          path="/stock-ma-plot" 
          element={
            <DataVisualizationPage 
              ChartComponent={StockDiagram} 
              ControlComponent={StockSearchControls}
            />
          } 
        />
        
        <Route 
          path="/2d-heatmap-dataset" 
          element={
            <DataVisualizationPage 
              ChartComponent={TwoDHeatmapDiagram} 
              ControlComponent={ListDatasetFromDBControls}
            />
          } 
        />

        <Route 
          path="/data-collect" 
          element={
            <DataCollectionPage 
              StockSearchControlsComponent={StockSearchControls}
              CandlestickDiagramComponent={StockDiagram}
              MiddlePanelComponent={DataCollectMiddlePanelControls}
              SavedDataListComponen={ListDatasetFromDBControls}
            />
          }
        />

        <Route path="/base" element={<BasePage />} />
      </Routes>
    </Router>
  );
}

export default App;