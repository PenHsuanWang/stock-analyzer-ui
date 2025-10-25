import React, { useState } from 'react';
import BasePage from './BasePage';
import '../styles/DataCollectionPage.css';

import { deleteDatasetInDB, computeFullAnalysisAndStore } from '../services/api';

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
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  
  // New states for loading and status
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Window sizes configuration - now exposed as state for future configurability
  const [windowSizes] = useState([5, 10, 20, 60, 90]);

  // Process and save the fetched data with full analysis
  const handleSaveData = async () => {
    // Validate search parameters
    if (!searchParams.stockId || !searchParams.startDate || !searchParams.endDate) {
      setStatusMessage({ 
        type: 'error', 
        message: 'Please fetch data first before saving.' 
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const response = await computeFullAnalysisAndStore({
        prefix: prefix,
        stock_id: searchParams.stockId,
        start_date: searchParams.startDate,
        end_date: searchParams.endDate,
        window_sizes: windowSizes
      });
      
      setStatusMessage({ 
        type: 'success', 
        message: `Successfully saved and analyzed ${searchParams.stockId} data.` 
      });
      setRefreshDataList(prev => !prev);
    } catch (error) {
      console.error("Failed to save data:", error);
      setStatusMessage({ 
        type: 'error', 
        message: `Failed to save data: ${error.message || 'Unknown error'}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle the deletion of selected datasets
  const handleDeleteData = async (selectedData) => {
    if (!selectedData || selectedData.length === 0) {
      setStatusMessage({ 
        type: 'error', 
        message: 'Please select datasets to delete.' 
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      let deletedCount = 0;
      for (const data of selectedData) {
        await deleteDatasetInDB({
          prefix: prefix,
          stock_id: data.stock_id,
          start_date: data.start_date,
          end_date: data.end_date
        });
        deletedCount++;
      }
      
      setStatusMessage({ 
        type: 'success', 
        message: `Successfully deleted ${deletedCount} dataset(s).` 
      });
      setRefreshDataList(prev => !prev);
    } catch (error) {
      console.error("Failed to delete data:", error);
      setStatusMessage({ 
        type: 'error', 
        message: `Failed to delete data: ${error.message || 'Unknown error'}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BasePage>
      <div className="main-content-top">
        <div className="main-content-data-search">
          {StockSearchControlsComponent && (
            <StockSearchControlsComponent 
              setChartData={setFetchedData} 
              setSearchParams={setSearchParams}
              dataPrefix={prefix}
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
        {statusMessage && (
          <div className={`status-message ${statusMessage.type}`}>
            {statusMessage.message}
          </div>
        )}
        {MiddlePanelComponent && (
          <MiddlePanelComponent 
            onSave={handleSaveData} 
            onDelete={handleDeleteData}
            searchParams={searchParams}
            selectedData={selectedDatasets}
            isLoading={isLoading}
          />
        )}
      </div>
      <div className="main-content-bottom">
        {SavedDataListComponent && (
          <SavedDataListComponent 
            prefix={prefix} 
            refresh={refreshDataList}
            setSelectedItems={setSelectedDatasets}
          />
        )}
      </div>
    </BasePage>
  );
}

export default DataCollectionPage;
