// src/components/containers/ExportControlPanel.js

import React, { useState } from 'react';
import { exportDataFromDB } from '../../services/api'; 
import LoadingIndicator from '../basic/LoadingIndicator';

const ExportControlPanel = ({ selectedData }) => {
  const [exportMode, setExportMode] = useState('csv');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSendData = async () => {
    const payload = JSON.stringify(selectedData);
    setLoading(true);
    setError('');
    try {
      if (exportMode === 'http') {
        await exportDataFromDB(url, payload, 'http');
      } else if (exportMode === 'csv') {
        console.log('Exporting to CSV');
        await exportDataFromDB(payload, 'csv');
      }
    } catch (error) {
      setError('Failed to send request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => setExportMode('csv')}>CSV Mode</button>
        <button onClick={() => setExportMode('http')}>HTTP Mode</button>
      </div>

      {exportMode === 'http' && (
        <div>
          <input 
            type="text" 
            placeholder="Enter HTTP URL" 
            value={url} 
            onChange={handleUrlChange} 
          />
          <button onClick={handleSendData}>Send</button>
        </div>
      )}

      {exportMode === 'csv' && (
        <div>
          <button onClick={handleSendData}>Export to CSV</button>
        </div>
      )}

      {loading && <LoadingIndicator />}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default ExportControlPanel;