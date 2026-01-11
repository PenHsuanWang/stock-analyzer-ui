// src/components/charts/ResponsiveChartContainer.js
import React, { useRef, useEffect } from 'react';
import useResizeObserver from '../../hooks/useResizeObserver';

/**
 * ResponsiveChartContainer - Wrapper for Plotly charts that handles resize events.
 * Triggers Plotly.relayout() when container dimensions change.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Chart component (Plot)
 * @param {string} [props.className] - Additional CSS class
 * @param {number} [props.minHeight=400] - Minimum container height
 * @returns {JSX.Element}
 */
const ResponsiveChartContainer = ({ 
  children, 
  className = '',
  minHeight = 400 
}) => {
  const plotRef = useRef(null);
  
  const handleResize = ({ width, height }) => {
    // Find the Plotly div inside and trigger relayout
    const plotDiv = plotRef.current?.querySelector('.js-plotly-plot');
    if (plotDiv && window.Plotly) {
      window.Plotly.relayout(plotDiv, {
        width: width,
        height: height
      });
    }
  };
  
  const { ref } = useResizeObserver(handleResize);
  
  // Merge refs
  useEffect(() => {
    if (ref.current) {
      plotRef.current = ref.current;
    }
  }, [ref]);
  
  return (
    <div 
      ref={ref}
      className={`responsive-chart-container ${className}`.trim()}
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: `${minHeight}px` 
      }}
    >
      {children}
    </div>
  );
};

export default ResponsiveChartContainer;
