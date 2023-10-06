import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import the necessary components
import StockDiagram from './pages/StockDiagram.js';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">Website Logo & Navigation</header>
        <nav>Navigation Bar / Menu</nav>

        <div className="App-content">
          <aside>
            Sidebar Content (e.g., related links, ads)
          </aside>
          <main className="Main-content">
            <Routes>
              {/* Define your routes */}
              <Route path="/stock-ma-plot" element={<StockDiagram />} />
              {/* Add other routes here */}
            </Routes>
          </main>
        </div>

        <footer>
          Footer Content
        </footer>
      </div>
    </Router>
  );
}

export default App;
