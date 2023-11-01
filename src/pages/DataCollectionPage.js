// pages/DataCollectionPage.js
import React, { useState } from 'react';
import BasePage from './BasePage';
import '../styles/DataCollectionPage.css'

function DataCollectionPage({
  StockSearchControlsComponent,
  CandlestickDiagramComponent,
  MiddlePanelComponent,
  SavedDataListComponent
}) {
  // State to hold the fetched data
  const [fetchedData, setFetchedData] = useState([]);

  return (
    <BasePage>
      <div className="main-content-top">
        <div className="main-content-data-search">
          {StockSearchControlsComponent && 
            <StockSearchControlsComponent setChartData={setFetchedData} />}
        </div>

        <div className="main-content-data-preview">
          {CandlestickDiagramComponent && 
            <CandlestickDiagramComponent data={fetchedData} />}
        </div>
      </div>

      <div className="main-content-middle">
        {MiddlePanelComponent && <MiddlePanelComponent />}
      </div>

      <div className="main-content-bottom">
        {SavedDataListComponent && <SavedDataListComponent />}
      </div>
    </BasePage>
  );
}

export default DataCollectionPage;
