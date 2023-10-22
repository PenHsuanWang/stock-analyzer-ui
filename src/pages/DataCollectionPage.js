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
      <div className="main-content-top">
        <div className="main-content-data-search">
          {StockSearchControlsComponent && <StockSearchControlsComponent />}
        </div>

        <div className="main-content-data-preview">
          {CandlestickDiagramComponent && <CandlestickDiagramComponent />}
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
