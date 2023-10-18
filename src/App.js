import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import the necessary components
import StockDiagramPage from './pages/StockDiagramPage.js';
import HomePage from './pages/HomePage.js'; // Import the HomePage component
import ATemplateChartPage from './pages/ATemplateChartPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define your routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/stock-ma-plot" element={<StockDiagramPage />} />
        <Route path="/atemplate" element={<ATemplateChartPage />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
