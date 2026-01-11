// src/components/basic/SplitPane.js
import React from 'react';
import '../../styles/SplitPane.css';

/**
 * SplitPane - Provides side-by-side layout for controls and visualization.
 * Implements the PRD "Analysis Dashboard" pattern (Section 5.1).
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.left - Control panel content
 * @param {React.ReactNode} props.right - Visualization/output content
 * @param {string} [props.leftWidth='320px'] - Width of left pane
 * @param {string} [props.gap='24px'] - Gap between panes
 * @param {string} [props.className] - Additional CSS class
 * @returns {JSX.Element}
 */
const SplitPane = ({ 
  left, 
  right, 
  leftWidth = '320px', 
  gap = '24px',
  className = '' 
}) => (
  <div 
    className={`split-pane ${className}`.trim()}
    style={{ 
      '--split-left-width': leftWidth,
      '--split-gap': gap 
    }}
  >
    <div className="split-pane__left">
      {left}
    </div>
    <div className="split-pane__right">
      {right}
    </div>
  </div>
);

export default SplitPane;
