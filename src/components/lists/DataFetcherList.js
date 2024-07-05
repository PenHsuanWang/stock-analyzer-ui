import React, { useState, useEffect } from 'react';
import { getDataFetcherList } from '../../services/api';
import '../../styles/ComponentList.css';

const DataFetcherList = ({ onSelect }) => {
  const [dataFetchers, setDataFetchers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataFetcherList = await getDataFetcherList();
        setDataFetchers(dataFetcherList.data_fetchers);
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
      <ul className="no-bullets">
        {dataFetchers.map((fetcher) => (
          <li key={fetcher}>
            <label>
              <input
                type="radio"
                name="dataFetcher"
                onChange={() => onSelect(fetcher)}
              />
              {fetcher}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataFetcherList;
