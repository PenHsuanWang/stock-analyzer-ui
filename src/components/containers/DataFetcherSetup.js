import React, { useState } from 'react';
import { setDataFetcher } from '../../services/api';
import '../../styles/DataFetcherSetup.css';

const DataFetcherSetup = ({ onSetupComplete }) => {
  const [dataFetcherName, setDataFetcherName] = useState('');
  const [status, setStatus] = useState(null);

  const handleSetup = async () => {
    try {
      const response = await setDataFetcher(dataFetcherName);
      setStatus(response.message);
      onSetupComplete();
    } catch (error) {
      setStatus('Error setting up data fetcher');
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
      <button onClick={handleSetup}>Set Data Fetcher</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default DataFetcherSetup;
