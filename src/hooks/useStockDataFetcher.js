// src/hooks/useStockDataFetcher.js
import { useState, useCallback } from 'react';
import { fetchDataFromBackendDB } from '../services/api';

export const useStockDataFetcher = (prefix) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (selectedDatasets) => {
    if (!selectedDatasets || selectedDatasets.length === 0) {
      setError('Please select at least one dataset to visualize');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fetchDataPromises = selectedDatasets.map(item =>
        fetchDataFromBackendDB({
          prefix: prefix,
          stock_id: item.stock_id,
          start_date: item.start_date,
          end_date: item.end_date
        })
      );

      const datasetsResponses = await Promise.all(fetchDataPromises);

      const transformedDatasets = datasetsResponses.map((response, index) => {
        if (!response || !Array.isArray(response.data)) {
          throw new Error('Response does not contain a data array');
        }
        
        const startDate = new Date(selectedDatasets[index].start_date);
        return response.data.map((dataPoint, valueIndex) => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + valueIndex);
          return {
            ...dataPoint,
            Date: date.toISOString().split('T')[0],
            _stockInfo: selectedDatasets[index]
          };
        });
      });

      setIsLoading(false);
      return transformedDatasets;
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(`Failed to load data: ${err.message}`);
      setIsLoading(false);
      return null;
    }
  }, [prefix]);

  return { fetchData, isLoading, error, setError };
};
