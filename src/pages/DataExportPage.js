import React, { useState, useCallback, useEffect } from 'react';
import BasePage from './BasePage';
import ListDatasetFromDBControls from '../components/containers/ListDatasetFromDBControls';
import ExportControlPanel from '../components/containers/ExportControlPanel';
import DataTable from '../components/containers/DataTable';
import { fetchDataFromBackendDB } from '../services/api';
import LoadingIndicator from '../components/basic/LoadingIndicator';
import '../styles/DataExportPage.css';

const DataExportPage = () => {
  const [selectedData, setSelectedData] = useState([]);
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  console.log("DataExportPage render", selectedData);

  const fetchDetailedData = useCallback((selectedKeys) => {
    console.log("fetchDetailedData started", selectedKeys);
    setLoading(true);
    setError('');
    const payload = {
      ...selectedKeys[0],
      prefix: "stock_data"
    };

    fetchDataFromBackendDB(payload)
      .then(response => {
        if (!Array.isArray(response.data)) {
          setError('API did not return an array.');
          setLoading(false);
          return;
        }
        setDetailedData(prevData => {
          console.log("Updating detailedData from", prevData, "to", response.data);
          return response.data;
        });
        setLoading(false);
      })
      .catch(err => {
        setError(err.response ? err.response.data.message : err.message);
        setLoading(false);
      }).finally(() => {
        console.log("fetchDetailedData completed", selectedKeys);
      });
  }, []);

  const handleSelectionChange = useCallback((selectedKeys) => {
    console.log("handleSelectionChange", selectedKeys);
    setSelectedData(selectedKeys);
  }, []);

  useEffect(() => {
    if (selectedData.length > 0) {
      fetchDetailedData(selectedData);
    } else {
      setDetailedData([]);
    }
  }, [selectedData, fetchDetailedData]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div className="data-export-error">Error: {error}</div>;
  }

  return (
    <BasePage>
      <div className="data-export-page-main-content">
        <div className="data-selection-section">
          <ListDatasetFromDBControls
            prefix={"stock_data"}
            setSelectedItems={handleSelectionChange}
          />
        </div>
        <div className="data-export-section">
          <ExportControlPanel
            selectedData={selectedData}
          />
        </div>
        <DataTable data={detailedData} />
      </div>
    </BasePage>
  );
};

export default React.memo(DataExportPage);
