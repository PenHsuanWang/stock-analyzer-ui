import React, { useState, useEffect } from 'react';
import { setDataFetcher, getDataFetcher } from '../../services/api';
import '../../styles/DataFetcherSetup.css';

const DataFetcherSetup = ({ selectedDataFetcher, onSetupComplete }) => {
  const [dataFetcherName, setDataFetcherName] = useState(selectedDataFetcher || '');
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedDataFetcher) {
      const fetchData = async () => {
        try {
          const dataFetcher = await getDataFetcher(selectedDataFetcher);
          setDataFetcherName(dataFetcher.name);
        } catch (error) {
          console.error('Error fetching data fetcher:', error);
        }
      };
      fetchData();
    }
  }, [selectedDataFetcher]);

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const response = await setDataFetcher(dataFetcherName);
      setStatus({ message: response.message, type: 'success' });
      onSetupComplete();
    } catch (error) {
      setStatus({ message: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="data-fetcher-setup">
      <h3>Setup Data Fetcher</h3>
      <input
        type="text"
        value={dataFetcherName}
        onChange={(e) => setDataFetcherName(e.target.value)}
        placeholder="Enter data fetcher name"
      />
      <button onClick={handleSetup} disabled={isLoading}>
        {isLoading ? 'Setting up...' : 'Set Data Fetcher'}
      </button>
      {status && <p className={`status ${status.type}`}>{status.message}</p>}
    </div>
  );
};

export default DataFetcherSetup;
