// src/pages/DataCollectionPage.js (Target State)
import React, { useState } from 'react';
import SplitPane from '../components/basic/SplitPane';
import ResponsiveChartContainer from '../components/charts/ResponsiveChartContainer';
import EmptyState from '../components/basic/EmptyState';
import '../styles/DataCollectionPage.css';
import { deleteDatasetInDB, computeFullAnalysisAndStore } from '../services/api';

function DataCollectionPage({
  StockSearchControlsComponent,
  CandlestickDiagramComponent,
  MiddlePanelComponent,
  SavedDataListComponent,
  prefix
}) {
  const [searchParams, setSearchParams] = useState({
    stockId: '',
    startDate: '',
    endDate: ''
  });

  const [fetchedData, setFetchedData] = useState([]);
  const [refreshDataList, setRefreshDataList] = useState(false);
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const [windowSizes] = useState([5, 10, 20, 60, 90]);

  const handleSaveData = async () => {
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
      await computeFullAnalysisAndStore({
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

  const leftPane = (
    <div className="control-deck">
      <section className="control-section">
        <h3 className="control-section__title">Search Parameters</h3>
        {StockSearchControlsComponent && (
          <StockSearchControlsComponent 
            setChartData={setFetchedData} 
            setSearchParams={setSearchParams}
            dataPrefix={prefix}
          />
        )}
      </section>
      
      <section className="control-section">
        {MiddlePanelComponent && (
          <MiddlePanelComponent 
            onSave={handleSaveData} 
            onDelete={handleDeleteData}
            searchParams={searchParams}
            selectedData={selectedDatasets}
            isLoading={isLoading}
          />
        )}
      </section>
      
      <section className="control-section control-section--scrollable">
        <h3 className="control-section__title">Saved Datasets</h3>
        {SavedDataListComponent && (
          <SavedDataListComponent 
            prefix={prefix} 
            refresh={refreshDataList}
            setSelectedItems={setSelectedDatasets}
            compact={true}
          />
        )}
      </section>
    </div>
  );

  const rightPane = (
    <div className="visual-deck">
      {statusMessage && (
        <div className={`status-banner status-banner--${statusMessage.type}`}>
          {statusMessage.message}
        </div>
      )}
      
      {fetchedData.length > 0 ? (
        <ResponsiveChartContainer minHeight={500}>
          {CandlestickDiagramComponent && (
             <CandlestickDiagramComponent data={fetchedData} />
          )}
        </ResponsiveChartContainer>
      ) : (
        <EmptyState 
          icon="📊"
          title="No Data Selected"
          description="Enter stock parameters and click 'Fetch Data' to view the candlestick chart."
        />
      )}
    </div>
  );

  return (
    <SplitPane 
      left={leftPane} 
      right={rightPane} 
      leftWidth="340px"
    />
  );
}

export default DataCollectionPage;