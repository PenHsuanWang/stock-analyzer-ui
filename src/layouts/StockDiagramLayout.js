import React from 'react';

const StockDiagramLayout = ({ children }) => {
  return (
    <div className="App">
      <header className="App-header">Website Logo & Navigation</header>
      <nav>Navigation Bar / Menu</nav>

      <div className="App-content">
        <aside>
          Sidebar Content (e.g., related links, ads)
        </aside>
        <main className="Main-content">
          {children}
        </main>
      </div>

      <footer>
        Footer Content
      </footer>
    </div>
  );
};

export default StockDiagramLayout;
