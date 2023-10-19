import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import the necessary components
import StockDiagramPage from './pages/StockDiagramPage.js';
import HomePage from './pages/HomePage.js'; // Import the HomePage component
import BasePage from './pages/BasePage.js';
import DataVisualizationPage from './pages/DataVisualizationPage';
import './styles/BasePage.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define your routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/stock-ma-plot" element={<DataVisualizationPage />} />
        <Route path="/base" element={<BasePage />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
