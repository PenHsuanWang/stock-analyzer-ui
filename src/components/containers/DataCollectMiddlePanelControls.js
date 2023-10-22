// src/components/Containers/DataCollectMiddlePanelControls.js
import React from 'react';
import { SaveButton, DeleteButton, SearchButton } from '../widgets/buttons/CustomButtons';

function DataCollectMiddlePanelControls() {
  return (
    <div className="middle-panel">
      <div className="middle-panel-buttons">
        <SaveButton onClick={() => console.log('Save clicked!')} />
        <DeleteButton onClick={() => console.log('Delete clicked!')} />
        <SearchButton onClick={() => console.log('Search clicked!')} />
      </div>
    </div>
  );
}

export default DataCollectMiddlePanelControls;
