import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.js';
import BasePage from './pages/BasePage.js';
import DataVisualizationPage from './pages/DataVisualizationPage';

import StockDiagram from './components/charts/StockDiagram';
import TwoDHeatmapDiagram from './components/charts/TwoDHeatmapDiagram';

import DatasetFromListControls from './components/containers/ListDatasetFromDBControls';
import StockSearchControls from './components/containers/StockSearchControls';

import './styles/BasePage.css';

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
              ControlComponent={DatasetFromListControls}
            />
          } 
        />

        <Route path="/base" element={<BasePage />} />
      </Routes>
    </Router>
  );
}

export default App;