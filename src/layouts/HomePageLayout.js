import React from 'react';

const HomePageLayout = ({ children }) => {
  return (
    <div className="App">
      <header className="App-header">Website Logo & Navigation</header>
      <nav>Navigation Bar / Menu</nav>

      <div className="App-content">
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

export default HomePageLayout;
