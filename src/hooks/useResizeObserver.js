// src/hooks/useResizeObserver.js
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useResizeObserver - Tracks element dimensions and triggers callback on resize.
 * Used to trigger Plotly.relayout() when chart container changes size.
 * 
 * @param {Function} [onResize] - Optional callback with { width, height }
 * @returns {{ ref: React.RefObject, width: number, height: number }}
 * 
 * @example
 * const { ref, width, height } = useResizeObserver();
 * // Attach ref to container: <div ref={ref}>
 */
const useResizeObserver = (onResize) => {
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const handleResize = useCallback((entries) => {
    if (!entries || entries.length === 0) return;
    
    const entry = entries[0];
    const { width, height } = entry.contentRect;
    
    setDimensions({ width, height });
    
    if (onResize) {
      onResize({ width, height });
    }
  }, [onResize]);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new ResizeObserver(handleResize);
    observer.observe(element);
    
    return () => {
      observer.disconnect();
    };
  }, [handleResize]);
  
  return { ref, ...dimensions };
};

export default useResizeObserver;
