// DataAnalysisPage.js
import React from 'react';
import BasePage from './BasePage';
import ListDatasetFromDBControls from '../components/containers/ListDatasetFromDBControls';
import '../styles/DataAnalysisPage.css'; 

function DataAnalysisPage({ savedDataPrefix, analyzedDataPrefix }) {
  return (
    <BasePage>
      <div className="data-analysis-page-container">
        <div className="data-list-container">
          <ListDatasetFromDBControls prefix={savedDataPrefix} />
          <button>Analyze</button>
        </div>
        <div className="data-list-container">
          <ListDatasetFromDBControls prefix={analyzedDataPrefix} />
          <button>Delete</button>
        </div>
      </div>
    </BasePage>
  );
}

export default DataAnalysisPage;
