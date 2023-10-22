// pages/DataCollectionPage.js
import React from 'react';
import BasePage from './BasePage';

import '../styles/DataCollectionPage.css'

function DataCollectionPage({
  StockSearchControlsComponent,
  CandlestickDiagramComponent,
  MiddlePanelComponent,
  SavedDataListComponent
}) {
  return (
    <BasePage>
      <div className="App-content-top">
        <div className="App-content-left">
          {StockSearchControlsComponent && <StockSearchControlsComponent />}
        </div>

        <div className="App-content-right">
          {CandlestickDiagramComponent && <CandlestickDiagramComponent />}
        </div>
      </div>

      <div className="App-content-middle">
        {MiddlePanelComponent && <MiddlePanelComponent />}
      </div>

      <div className="App-content-bottom">
        {SavedDataListComponent && <SavedDataListComponent />}
      </div>
    </BasePage>
  );
}

export default DataCollectionPage;
