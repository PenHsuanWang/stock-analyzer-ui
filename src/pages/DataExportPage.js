import React, { useState, useEffect } from 'react';
import BasePage from './BasePage';
import ListDatasetFromDBControls from '../components/containers/ListDatasetFromDBControls';
import ExportControlPanel from '../components/containers/ExportControlPanel';
import DataTable from '../components/containers/DataTable';
import { fetchDataFromBackendDB } from '../services/api';
import LoadingIndicator from '../components/basic/LoadingIndicator';
import '../styles/DataExportPage.css';

function DataExportPage() {
  const [selectedData, setSelectedData] = useState([]);
  const [detailedData, setDetailedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDetailedData = async () => {
    if (selectedData.length === 0) {
      // Reset detailedData if no data selected
      setDetailedData([]);
      return;
    }
    setLoading(true);
    setError('');
    const payload = {
      ...selectedData[0],
      prefix: "stock_data"
    };
    try {
      const response = await fetchDataFromBackendDB(payload);
      if (!Array.isArray(response.data)) {
        setError('API did not return an array.');
        setDetailedData([]);
      } else {
        setDetailedData(response.data);
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
      setDetailedData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailedData();
  }, [selectedData]);

  return (
    <BasePage>
      <div className="data-export-page-main-content">
        <div className="data-selection-section">
          <ListDatasetFromDBControls
            prefix={"stock_data"}
            setSelectedItems={setSelectedData}
          />
        </div>
        <div className="data-export-section">
          <ExportControlPanel
            selectedData={selectedRows}
          />
        </div>
        <div className="data-preview-section">
          {loading ? (
            <LoadingIndicator />
          ) : error ? (
            <div className="data-export-error">Error: {error}</div>
          ) : (
            <DataTable data={detailedData} onSelectionChange={setSelectedRows} />
          )}
        </div>  
      </div>
    </BasePage>
  );
}

export default DataExportPage;
