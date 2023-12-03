import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/Sidebar.css';

const SidebarGroup = ({ label, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="SidebarGroupButton" onClick={() => setIsOpen(!isOpen)}>
        {icon && <span className="icon">{icon}</span>}
        <span className="SidebarGroupLabel">{label}</span>
        <span className="DropdownArrow">{isOpen ? '▼' : '►'}</span>
      </div>
      <div className={`SidebarGroupContent ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );
};

const SidebarLink = ({ to, label, icon }) => (
  <div className="SidebarLink">
    <NavLink to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
      {icon && <span className="icon">{icon}</span>}
      {label}
    </NavLink>
  </div>
);

const Sidebar = () => (
  <aside className="Sidebar">
    <h3>Stock Analysis Tools</h3>
    <div className="SidebarNavigation">
      <SidebarGroup label="Group A" icon="🗂️">
        <SidebarLink to="/" label="Home" icon="🏠" />
        <SidebarLink to="/data-collect" label="Data Collection" icon="📊" />
        <SidebarLink to="/data-analysis" label="Data Analysis" icon="🔍" />
        <SidebarLink to="/analyzed-visualization-candlestick" label="Candlestick Visualization" icon="📈" />
        <SidebarLink to="/analyzed-visualization-heatmap" label="Heatmap Visualization" icon="🌡️" />
        <SidebarLink to="/analyzed-visualization-histogram" label="Histogram Visualization" icon="📊" />
        <SidebarLink to="/analyzed-visualization-pairgrid" label="Pairgrid Visualization" icon="🔲" />
        <SidebarLink to="/correlation-analysis" label="Correlation Analysis" icon="🔗" />
        <SidebarLink to="/base" label="Base Page" icon="🛠️" />
      </SidebarGroup>
      {/* Additional groups and links can be added here */}
    </div>
    <div className="sidebar-ads">
      <p>Advertisement Here</p>
      {/* Place ad scripts or other ad-related content here */}
    </div>
  </aside>
);

export default Sidebar;
