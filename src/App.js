import React from 'react';
import './App.css';
import StockDiagramLayout from './layouts/StockDiagramLayout.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import the necessary components
import StockDiagram from './pages/StockDiagram.js';
import HomePage from './pages/HomePage.js'; // Import the HomePage component

function App() {
  return (
    <Router>
      <StockDiagramLayout>
        <Routes>
          {/* Define your routes */}
          <Route path="/stock-ma-plot" element={<StockDiagram />} />
          {/* Add other routes here */}
        </Routes>
      </StockDiagramLayout>
    </Router>
  );
}

export default App;
