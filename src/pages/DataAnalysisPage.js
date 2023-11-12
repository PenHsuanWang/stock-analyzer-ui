// DataAnalysisPage.js
import React, { useState } from 'react';
import BasePage from './BasePage';
import ListDatasetFromDBControls from '../components/containers/ListDatasetFromDBControls';
import { computeFullAnalysisAndStore, deleteDatasetInDB } from '../services/api';
import '../styles/DataAnalysisPage.css'; 

function DataAnalysisPage({ savedDataPrefix, analyzedDataPrefix }) {

  // State to track selected items for analysis and deletion
  const [selectedForAnalysis, setSelectedForAnalysis] = useState([]);
  const [selectedForDeletion, setSelectedForDeletion] = useState([]);

  // state to refresh the list
  const [refreshRawDataKey, setRefreshRawDataKey] = useState(0);
  const [refreshAnalyzedDataKey, setRefreshAnalyzedDataKey] = useState(0);

  // Event handler for the 'Analyze' button
  const handleAnalyze = async () => {
    // Assume window_sizes is fixed for this example
    const window_sizes = [5, 10, 20, 60, 90];
    
    // Call API for each selected item
    const analysisPromises = selectedForAnalysis.map(item => 
      computeFullAnalysisAndStore({
        prefix: savedDataPrefix,
        stock_id: item.stock_id,
        start_date: item.start_date,
        end_date: item.end_date,
        window_sizes
      })
    );

    try {
      // Wait for all the analysis to be completed
      await Promise.all(analysisPromises);
      // Handle success, such as refreshing the list to show new data
      setRefreshAnalyzedDataKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error("Error during analysis:", error);
      // Handle errors, such as displaying a message to the user
    }
  };

  // Event handler for the 'Delete' button
  const handleDelete = async () => {
    const deletePromises = selectedForDeletion.map(item =>
      deleteDatasetInDB({
        prefix: analyzedDataPrefix,
        stock_id: item.stock_id,
        start_date: item.start_date,
        end_date: item.end_date
      })
    );

    try {
      // Wait for all deletions to complete
      await Promise.all(deletePromises);
      // Handle success, such as refreshing the list
      setRefreshAnalyzedDataKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error("Error during deletion:", error);
      // Handle errors
    }
  };

  return (
    <BasePage>
      <div className="data-analysis-page-container">
        <div className="data-list-container">
          <ListDatasetFromDBControls
            key={refreshRawDataKey}
            prefix={savedDataPrefix}
            setSelectedItems={setSelectedForAnalysis}
          />
          <button onClick={handleAnalyze}>Analyze</button>
        </div>
        <div className="data-list-container">
          <ListDatasetFromDBControls
            key={refreshAnalyzedDataKey}
            prefix={analyzedDataPrefix}
            setSelectedItems={setSelectedForDeletion}
          />
          <button onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </BasePage>
  );
}

export default DataAnalysisPage;
