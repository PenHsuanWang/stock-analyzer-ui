// pages/DataCollectionPage.js
import React, { useState } from 'react';
import BasePage from './BasePage';
import '../styles/DataCollectionPage.css'

import { fetchAndStashData } from '../services/api';

function DataCollectionPage({
  StockSearchControlsComponent,
  CandlestickDiagramComponent,
  MiddlePanelComponent,
  SavedDataListComponent
}) {
  // State to hold the fetched data

  const [searchParams, setSearchParams] = useState({
    stockId: '',
    startDate: '',
    endDate: ''
  });

  const [fetchedData, setFetchedData] = useState([]);

  // process the stashed data
  const handleSaveData = async () => {
    try {
      // send the request to backend for event handling
      console.log(searchParams)
      console.log(typeof searchParams)
      const response = await fetchAndStashData(searchParams);
      console.log(response);
    } catch (error) {
      console.error("Failed to save data:", error);
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
          <MiddlePanelComponent onSave={handleSaveData} />
        )}
      </div>
      <div className="main-content-bottom">
        {SavedDataListComponent && <SavedDataListComponent />}
      </div>
    </BasePage>
  );
}

export default DataCollectionPage;
