// src/components/Containers/DataCollectMiddlePanelControls.js
import React from 'react';
import { SaveButton, DeleteButton, SearchButton } from '../widgets/buttons/CustomButtons';

function DataCollectMiddlePanelControls({ onSave }) {
  return (
    <div className="middle-panel">
      <div className="middle-panel-buttons">
        <SaveButton onClick={onSave} />
        <DeleteButton onClick={() => console.log('Delete clicked!')} />
        <SearchButton onClick={() => console.log('Search clicked!')} />
      </div>
    </div>
  );
}

export default DataCollectMiddlePanelControls;
