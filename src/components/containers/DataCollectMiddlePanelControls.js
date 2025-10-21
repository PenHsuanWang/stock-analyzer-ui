// src/components/Containers/DataCollectMiddlePanelControls.js
import React from 'react';
import { SaveButton, DeleteButton, SearchButton } from '../widgets/buttons/CustomButtons';

function DataCollectMiddlePanelControls({ onSave, onDelete, searchParams, selectedData, isLoading }) {

  // the activated function for save button
  const handleSave = async () => {
    // type check
    if (
      typeof searchParams.stockId !== 'string' ||
      typeof searchParams.startDate !== 'string' ||
      typeof searchParams.endDate !== 'string'
    ) {
      console.error('Invalid data types for the request payload');
      return;
    }
    
    await onSave(searchParams);
  };

  // function to handle the delete operation
  const handleDelete = async () => {
    if (selectedData.length === 0) {
      console.error('No data selected to delete');
      return;
    }

    await onDelete(selectedData);
  };

  return (
    <div className="middle-panel">
      <div className="middle-panel-buttons">
        <SaveButton 
          onClick={handleSave} 
          disabled={isLoading}
        />
        <DeleteButton 
          onClick={handleDelete} 
          disabled={isLoading || selectedData.length === 0}
        />
        <SearchButton 
          onClick={() => console.log('Search clicked!')} 
          disabled={isLoading}
        />
      </div>
      {isLoading && (
        <div className="loading-indicator">
          Processing...
        </div>
      )}
    </div>
  );
}

export default DataCollectMiddlePanelControls;
