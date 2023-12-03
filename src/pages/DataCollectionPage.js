import React, { useState } from 'react';
import BasePage from './BasePage';
import '../styles/DataCollectionPage.css';

import { fetchAndStashData, deleteDatasetInDB, computeFullAnalysisAndStore } from '../services/api';

function DataCollectionPage({
  StockSearchControlsComponent,
  CandlestickDiagramComponent,
  MiddlePanelComponent,
  SavedDataListComponent,
  prefix
}) {
  // State to hold the fetched data
  const [searchParams, setSearchParams] = useState({
    stockId: '',
    startDate: '',
    endDate: ''
  });

  const [fetchedData, setFetchedData] = useState([]);

  const [refreshDataList, setRefreshDataList] = useState(false);

  // Add state to keep track of selected datasets for deletion
  const [selectedDatasets, setSelectedDatasets] = useState([]);


  // process the stashed data
  const handleSaveData = async () => {
    // Assume window_sizes is fixed for this example
    const window_sizes = [5, 10, 20, 60, 90];

    try {
      // send the request to backend for event handling
      console.log(searchParams);
      const response = await computeFullAnalysisAndStore({
        prefix: prefix,
        stock_id: searchParams.stockId,
        start_date: searchParams.startDate,
        end_date: searchParams.endDate,
        window_sizes
      });
      console.log(response);
      setRefreshDataList(prev => !prev); // Toggle the state to trigger a refresh StoredDataList
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  };

  // function to handle the deletion of selected datasets
  const handleDeleteData = async (selectedData) => {
    try {
      for (const data of selectedData) {
        // Make sure to send the data in the correct format
        await deleteDatasetInDB({
          prefix: prefix,
          stock_id: data.stock_id,
          start_date: data.start_date,
          end_date: data.end_date
        });
      }
      setRefreshDataList(prev => !prev); // Refresh the list to show updated data
    } catch (error) {
      console.error("Failed to delete data:", error);
    }
  };

  return (
    <BasePage>
      <div className="main-content-top">
        <div className="main-content-data-search">
          {StockSearchControlsComponent && (
            <StockSearchControlsComponent 
              setChartData={setFetchedData} 
              setSearchParams={setSearchParams} // Pass setSearchParams as a prop
            />
          )}
        </div>
        <div className="main-content-data-preview">
          {CandlestickDiagramComponent && (
            <CandlestickDiagramComponent data={fetchedData} />
          )}
        </div>
      </div>
      <div className="main-content-middle">
        {MiddlePanelComponent && (
          <MiddlePanelComponent 
            onSave={handleSaveData} 
            onDelete={handleDeleteData} // Pass the new handleDeleteData function as a prop
            searchParams={searchParams}
            selectedData={selectedDatasets} // Pass the selected datasets for deletion
          />
        )}
      </div>
      <div className="main-content-bottom">
        {SavedDataListComponent && (
          <SavedDataListComponent 
            prefix={prefix} 
            refresh={refreshDataList}
            setSelectedItems={setSelectedDatasets} // Allow the list component to update the selected datasets
          />
        )}
      </div>
    </BasePage>
  );
}

export default DataCollectionPage;
