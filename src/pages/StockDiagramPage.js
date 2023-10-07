import React from 'react';
import StockDiagram from '../components/StockDiagram.js';

const StockDiagramPage = ({ children }) => {
  return (
    <div className="App">
      <header className="App-header">Website Logo & Navigation</header>
      <nav>Navigation Bar / Menu</nav>

      <div className="App-content">
        <aside>
          Sidebar Content (e.g., related links, ads)
        </aside>
        <main className="Main-content">
          <StockDiagram />
        </main>
      </div>

      <footer>
        Footer Content
      </footer>
    </div>
  );
};

export default StockDiagramPage;
