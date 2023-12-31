import React, { useState, useEffect, useCallback } from 'react';
import BasePage from './BasePage';
import ListDatasetFromDBControls from '../components/containers/ListDatasetFromDBControls';
import ExportControlPanel from '../components/containers/ExportControlPanel';
import DataTable from '../components/containers/DataTable'; // Make sure this component exists
import { fetchDataFromBackendDB } from '../services/api';
import LoadingIndicator from '../components/basic/LoadingIndicator'; // Assume this component exists
import '../styles/DataExportPage.css';

const DataExportPage = () => {
  const [selectedData, setSelectedData] = useState([]); // Holds the keys/identifiers for selected datasets
  const [detailedData, setDetailedData] = useState([]); // Holds the detailed data for the DataTable
  const [loading, setLoading] = useState(false); // State to manage loading indicator
  const [error, setError] = useState(''); // State to manage error message

  // Handler to update selected data from ListDatasetFromDBControls
  const handleSelectionChange = useCallback((selectedKeys) => {
    // console.log("here inside the handle SelectionChagne")
    // console.log(selectedKeys)
    setSelectedData(selectedKeys);
    // Fetch the detailed data for the selected datasets
    fetchDetailedData(selectedKeys);
  }, []);

  // Fetch detailed data for the selected datasets
  const fetchDetailedData = (selectedKeys) => {
    if (selectedKeys.length > 0) {
      setLoading(true);
      setError('');
      console.log("here inside the fetch data");
      console.log(selectedKeys[0]);
  
      const payload = {
        ...selectedKeys[0],
        prefix: "stock_data"
      };
  
      fetchDataFromBackendDB(payload)
        .then(response => {
          console.log('API Response:', response); // Log the response
          // Assuming the response object contains a `data` property which is the array you want
          if (!Array.isArray(response.data)) {
            console.error('Expected an array but got:', typeof response.data);
            setError('API did not return an array.');
            setLoading(false);
            return;
          }
          setDetailedData(response.data); // Pass the array to the state
          setLoading(false);
        })
        .catch(err => {
          console.error('API Error:', err);
          setError(err.response ? err.response.data.message : err.message);
          setLoading(false);
        });
    } else {
      setDetailedData([]); // Clear the detailed data if no selection
    }
  };
  

  useEffect(() => {
    // Fetch the initial list of datasets here if needed
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div className="data-export-error">Error: {error}</div>;
  }

  return (
    <BasePage>
      <div className="data-export-page-main-content">
        {/* Section for selecting datasets */}
        <div className="data-selection-section">
          <ListDatasetFromDBControls
            prefix={"stock_data"}
            setSelectedItems={handleSelectionChange}
          />
        </div>
        {/* Section for data export controls */}
        <div className="data-export-section">
          <ExportControlPanel
            selectedData={selectedData}
          />
        </div>
        {/* DataTable component to display the detailed content of selected data */}
        <DataTable data={detailedData} />
      </div>
    </BasePage>
  );
};

export default DataExportPage;
