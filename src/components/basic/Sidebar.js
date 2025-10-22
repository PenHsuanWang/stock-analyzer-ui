import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Sidebar.css';


const menuItems = [
  {
    name: '🗂️ Group A', // group level folder
    isCollapsible: true,
    children: [
      { name: '🏠 Home', isCollapsible: false, children: [], to: '/' },
      { name: '📊 Data Collection', isCollapsible: false, children: [], to: '/data-collect' },
      { name: '📈 Candlestick Visualization', isCollapsible: false, children: [], to: '/analyzed-visualization-candlestick' },
      { name: '🌡️ Heatmap Visualization', isCollapsible: false, children: [], to: '/analyzed-visualization-heatmap' },
      { name: '📊 Histogram Visualization', isCollapsible: false, children: [], to: '/analyzed-visualization-histogram' },
      { name: '🔲 Pairgrid Visualization', isCollapsible: false, children: [], to: '/analyzed-visualization-pairgrid' },
      { name: '🔗 Correlation Analysis', isCollapsible: false, children: [], to: '/correlation-analysis' },
      { name: '🛠️ Base Page', isCollapsible: false, children: [], to: '/base' },
    ],
  },
  {
    name: '🛠️ Group B',
    isCollapsible: true,
    children: [
      { name: '📊 Data Analysis', isCollapsible: false, children: [], to: '/data-analysis' },
      { name: '📈 Candlestick with Pattern', isCollapsible: false, children: [], to: '/analyzed-visualization-candlestick-with-pattern' },
      { name: '📈 Advanced Visualization', isCollapsible: false, children: [], to: '/advance-analyzed-visualization' },
      { name: '🎯 Technical Analysis (Unified)', isCollapsible: false, children: [], to: '/analyzed-visualization-candlestick-technical-analysis' },
      { name: '📊 Data Export', isCollapsible: false, children: [], to: '/data-export' },
      { name: '🛠️ Model Management', isCollapsible: false, children: [], to: '/model-manage' },
      { name: '🔍 Model Comparison', isCollapsible: false, children: [], to: '/model-comparison' },
    ],
  },
  // others menu items can be added here
];

// recursive displat items
function SidebarItem({ item, onToggle, isOpen }) {
  const content = item.children.map((child) => {
    if (typeof child === 'string') {
      return <div key={child} className="SubmenuItem">{child}</div>;
    } else {
      // to use Link or NavLink to jump to other pages
      return (
        <Link to={child.to} className="SubmenuItem" key={child.name}>
          <SidebarItem item={child} onToggle={onToggle} isOpen={isOpen}/>
        </Link>
      );
    }
  });

  return (
    <div>
      <div className="MenuItem" onClick={() => onToggle(item.name)}>
        {item.name}
      </div>
      {isOpen && content}
    </div>
  );
}

function Sidebar() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (name) => {
    setOpenItems(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <div className="Sidebar">
      <div className="SearchBox">
        <input type="text" placeholder="Search this site..." className="SearchInput" />
      </div>
      {menuItems.map((item) => (
        <SidebarItem key={item.name} item={item} onToggle={toggleItem} isOpen={openItems[item.name]} />
      ))}
    </div>
  );
}


export default Sidebar;
