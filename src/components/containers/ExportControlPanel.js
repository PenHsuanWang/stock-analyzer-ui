// src/components/containers/ExportControlPanel.js

import React, { useState } from 'react';
import { exportDataFromDB } from '../../services/api';
import LoadingIndicator from '../basic/LoadingIndicator';
import DataSendingDialog from '../basic/DataSendingDialog';  // Assuming a basic dialog component is available

const ExportControlPanel = ({ selectedData }) => {
  const [exportMode, setExportMode] = useState('csv');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const validateUrl = (url) => {
    // Simple URL validation
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
  };

  const handleSendData = async () => {
    console.log("Send data called");  // Check if function is invoked
    if (exportMode === 'http' && !validateUrl(url)) {
      console.log("URL validation failed"); // Check URL validation
      setError("Invalid URL format");
      return;
    }
    console.log("URL is valid, proceeding with export"); // Check flow past URL validation
    setLoading(true);
    setDialogVisible(true);
    setError('');
    setSuccessMessage('');

    try {
      const payload = JSON.stringify(selectedData);
      console.log("Payload prepared:", payload); // Log payload to verify it's correct
      if (exportMode === 'http') {
        console.log("Attempting HTTP export");
        await exportDataFromDB(url, payload, 'http');
        setSuccessMessage('Data has been sent successfully!');
      } else if (exportMode === 'csv') {
        console.log("Attempting CSV export");
        await exportDataFromDB(payload, 'csv');
        setSuccessMessage('Data exported to CSV successfully!');
      }
    } catch (err) {
      console.error("Export failed:", err);
      setError(`Failed to send request: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };


  const handleCloseDialog = () => {
    setDialogVisible(false);
    setError('');
    setSuccessMessage('');
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

      {dialogVisible && (
        <DataSendingDialog onClose={handleCloseDialog} title="Export Status">
          {loading ? <LoadingIndicator /> : (error ? `Error: ${error}` : successMessage)}
        </DataSendingDialog>
      )}
    </div>
  );
};

export default ExportControlPanel;
