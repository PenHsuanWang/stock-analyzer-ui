// src/hooks/useCandlestickPatterns.js
import { useState, useCallback } from 'react';

export const useCandlestickPatterns = () => {
  const [availablePatterns, setAvailablePatterns] = useState([]);
  const [selectedPatterns, setSelectedPatterns] = useState([]);

  const extractPatterns = useCallback((dataSets) => {
    const patternsSet = new Set(
      dataSets.flatMap(dataSet => 
        dataSet.map(item => item.Pattern).filter(Boolean)
      )
    );
    const patterns = Array.from(patternsSet);
    setAvailablePatterns(patterns);
    return patterns;
  }, []);

  const resetPatterns = useCallback(() => {
    setAvailablePatterns([]);
    setSelectedPatterns([]);
  }, []);

  return {
    availablePatterns,
    selectedPatterns,
    setSelectedPatterns,
    extractPatterns,
    resetPatterns
  };
};
