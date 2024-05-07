// src/components/Containers/DataCollectMiddlePanelControls.js
import React from 'react';
import { SaveButton, DeleteButton, SearchButton } from '../widgets/buttons/CustomButtons';

function DataCollectMiddlePanelControls({ onSave, onDelete, searchParams, selectedData  }) {

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
    
    await onSave(searchParams); // using outer component's searchParams as payload
  };

  // function to handle the delete operation
  const handleDelete = async () => {
    if (selectedData.length === 0) {
      console.error('No data selected to delete');
      return;
    }

    await onDelete(selectedData); // Pass the selected data to the parent component to handle deletion
  };

  return (
    <div className="middle-panel">
      <div className="middle-panel-buttons">
        <SaveButton onClick={handleSave} />
        <DeleteButton onClick={handleDelete} />
        <SearchButton onClick={() => console.log('Search clicked!')} />
      </div>
    </div>
  );
}

export default DataCollectMiddlePanelControls;
