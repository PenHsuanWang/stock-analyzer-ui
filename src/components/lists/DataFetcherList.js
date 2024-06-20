import React, { useState, useEffect } from 'react';
import { getDataFetcher } from '../../services/api';
import '../../styles/ComponentList.css';

const DataFetcherList = () => {
  const [dataFetchers, setDataFetchers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataFetcher = await getDataFetcher();
        setDataFetchers(dataFetcher.data_fetchers || []);
      } catch (err) {
        setError(err.message || 'No response from the server. Please check your network connection.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="component-list">
      <h4>Existing Data Fetchers</h4>
      {error && <p className="error">{error}</p>}
      <ul>
        {dataFetchers.map((fetcher) => (
          <li key={fetcher}>{fetcher}</li>
        ))}
      </ul>
    </div>
  );
};

export default DataFetcherList;
