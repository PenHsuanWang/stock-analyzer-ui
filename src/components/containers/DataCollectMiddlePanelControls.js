// src/components/Containers/DataCollectMiddlePanelControls.js
import React from 'react';
import { SaveButton, DeleteButton, SearchButton } from '../widgets/buttons/CustomButtons';

function DataCollectMiddlePanelControls({ onSave, searchParams }) {

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
    
    await onSave(searchParams); // 使用來自父組件的 searchParams 作為 payload
  };

  return (
    <div className="middle-panel">
      <div className="middle-panel-buttons">
        <SaveButton onClick={handleSave} />
        <DeleteButton onClick={() => console.log('Delete clicked!')} />
        <SearchButton onClick={() => console.log('Search clicked!')} />
      </div>
    </div>
  );
}

export default DataCollectMiddlePanelControls;
