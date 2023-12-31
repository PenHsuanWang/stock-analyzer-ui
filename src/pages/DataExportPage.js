import React, { useState } from 'react';
import BasePage from './BasePage'; // Import BasePage for consistent layout
import ListDatasetFromDBControls from '../components/containers/ListDatasetFromDBControls';
import ExportControlPanel from '../components/containers/ExportControlPanel'; // Import the new ExportControlPanel component
import '../styles/DataExportPage.css'

// Renamed to DataExportPage to reflect its functionality
const DataExportPage = () => {
  const [selectedData, setSelectedData] = useState([]);

  // Handler to update selected data from ListDatasetFromDBControls
  const handleSelectionChange = (selected) => {
    setSelectedData(selected);
  };

  return (
    <BasePage> {/* Wrap content inside BasePage */}
      <div className="data-export-page-main-content">
        {/* Component for selecting data */}
        <div className="data-selection-section">
          <ListDatasetFromDBControls 
            prefix={"stock_data"} 
            setSelectedItems={handleSelectionChange} 
          />
        </div>
        {/* Component for handling data export functionality */}
        <div className="data-export-section">
          <ExportControlPanel 
            selectedData={selectedData} 
          />
        </div>
      </div>
    </BasePage>
  );
};
export default DataExportPage;
