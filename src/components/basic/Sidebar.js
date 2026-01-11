import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/Sidebar.css';

const navigationGroups = [
  {
    id: 'group-a',
    label: 'Fundamentals',
    icon: '📘',
    defaultOpen: true,
    children: [
      {
        id: 'home',
        label: 'Overview',
        icon: '🏠',
        to: '/',
      },
      {
        id: 'data-fetch',
        label: 'Data Fetch',
        icon: '🔁',
        defaultOpen: true,
        children: [
          { id: 'manual-fetch', label: 'Manual Fetch', icon: '⚡', to: '/data-collect' },
          { id: 'job-scheduler', label: 'Job Scheduler', icon: '⏱️', to: '/job-scheduler' },
        ],
      },
      {
        id: 'dataset-list',
        label: 'Dataset List',
        icon: '🗂️',
        to: '/data-analysis',
      },
      {
        id: 'basic-analytics',
        label: 'Basic Analytics',
        icon: '📊',
        defaultOpen: true,
        children: [
          { id: 'histogram', label: 'Daily Return Histogram', icon: '📈', to: '/analyzed-visualization-histogram' },
          { id: 'heatmap', label: 'Heat Map', icon: '🌡️', to: '/analyzed-visualization-heatmap' },
          { id: 'correlation', label: 'Correlation Scatter', icon: '🧮', to: '/correlation-analysis' },
        ],
      },
      {
        id: 'data-export',
        label: 'Data Export',
        icon: '📤',
        to: '/data-export',
      },
    ],
  },
  {
    id: 'group-b',
    label: 'Advanced',
    icon: '🚀',
    defaultOpen: true,
    children: [
      {
        id: 'stock-analysis',
        label: 'Stock Analysis',
        icon: '📊',
        to: '/stock-analysis-dashboard',
      },
      {
        id: 'ml-analysis',
        label: 'ML Analysis',
        icon: '🤖',
        defaultOpen: true,
        children: [
          { id: 'model-training-setup', label: 'Training Setup', icon: '🛠️', to: '/model-training-setup' },
          { id: 'trainer-control', label: 'Trainer Control', icon: '📡', to: '/trainer-control' },
          { id: 'model-manage', label: 'Model Management', icon: '📁', to: '/model-manage' },
          { id: 'model-comparison', label: 'Model Comparison', icon: '⚖️', to: '/model-comparison' },
        ],
      },
    ],
  },
];

const buildInitialExpansionState = (items, acc = {}) => {
  items.forEach((item) => {
    if (Array.isArray(item.children) && item.children.length > 0) {
      acc[item.id] = item.defaultOpen ?? true;
      buildInitialExpansionState(item.children, acc);
    }
  });
  return acc;
};

const SidebarItem = ({ item, expanded, toggle }) => {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  if (hasChildren) {
    return (
      <div className="sidebar-node">
        <button
          type="button"
          className="sidebar-node__button"
          onClick={() => toggle(item.id)}
          aria-expanded={!!expanded[item.id]}
        >
          <div className="sidebar-node__label">
            {item.icon && (
              <span className="sidebar-node__icon" aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
          </div>
          <span className="sidebar-node__chevron" aria-hidden="true">
            {expanded[item.id] ? '−' : '+'}
          </span>
        </button>
        {expanded[item.id] && (
          <div className="sidebar-node__children">
            {item.children.map((child) => (
              <SidebarItem
                key={child.id}
                item={child}
                expanded={expanded}
                toggle={toggle}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        ['sidebar-link', isActive ? 'active' : ''].join(' ').trim()
      }
    >
      {item.icon && (
        <span className="sidebar-node__icon" aria-hidden="true">
          {item.icon}
        </span>
      )}
      <span>{item.label}</span>
    </NavLink>
  );
};

function Sidebar() {
  const [expanded, setExpanded] = useState(() => buildInitialExpansionState(navigationGroups));

  const toggleItem = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="sidebar-inner">
      <div className="Sidebar-search">
        <input
          type="text"
          placeholder="Search..."
          aria-label="Search navigation"
        />
      </div>
      <nav className="Sidebar-nav">
        {navigationGroups.map((group) => (
          <SidebarItem
            key={group.id}
            item={group}
            expanded={expanded}
            toggle={toggleItem}
          />
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;