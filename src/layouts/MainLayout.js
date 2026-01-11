// src/layouts/MainLayout.js
import React from 'react';
import Sidebar from '../components/basic/Sidebar';
import Header from '../components/basic/Header';
import './MainLayout.css';

/**
 * MainLayout - The immutable App Shell that wraps all pages.
 * Uses CSS Grid to create fixed Sidebar/Header with scrollable Main content.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 * @returns {JSX.Element}
 */
const MainLayout = ({ children }) => (
  <div className="app-shell">
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
    <aside className="shell-sidebar">
      <Sidebar />
    </aside>
    <header className="shell-header">
      <Header title="Stock Analyzer" />
    </header>
    <main id="main-content" className="shell-main" tabIndex="-1">
      {children}
    </main>
  </div>
);

export default MainLayout;