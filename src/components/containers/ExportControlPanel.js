import React, { useState } from 'react';
import { exportDataFromDB } from '../../services/api'; 

const ExportControlPanel = ({ selectedData }) => {
  const [exportMode, setExportMode] = useState('csv');
  const [url, setUrl] = useState('');

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSendData = () => {
    if (exportMode === 'http') {
      exportDataFromDB(url, selectedData);
    } else if (exportMode === 'csv') {
      console.log('Exporting to CSV');
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
    </div>
  );
};

export default ExportControlPanel;
