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
    // Extended URL validation to correctly handle localhost and common URLs
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '(localhost|(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,})'+ // domain name (localhost or valid domain)
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
  };  

  const prepareJsonSplitFormat = (data) => {
    const columns = Object.keys(data[0]);
    const rows = data.map(item => Object.values(item));
    return { columns, data: rows };
  };


  const handleSendData = async () => {
    if (exportMode === 'http' && !validateUrl(url)) {
      setError("Invalid URL format. Please enter a valid URL.");
      setDialogVisible(true);
      return;
    }

    setLoading(true);
    setDialogVisible(true);
    setError('');
    setSuccessMessage('');

    try {
      // Prepare data in the format expected by the backend
      const formattedData = prepareJsonSplitFormat(selectedData);
      const jsonPayload = JSON.stringify({ data: JSON.stringify(formattedData) });
      const response = await exportDataFromDB(url, jsonPayload, exportMode);

      if (exportMode === 'http' && response && response.message) {
        setSuccessMessage('Data has been sent successfully!');
      } else if (exportMode === 'csv' && response.success) {
        setSuccessMessage('Data exported to CSV successfully!');
      } else {
        throw new Error(response.message || "Unknown error from server");
      }
    } catch (err) {
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
