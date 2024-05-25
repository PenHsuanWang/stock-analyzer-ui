import React from 'react';
import Dropdown from "../widgets/Dropdown"

const ModelSelector = ({ modelName, setModelName, version, setVersion, modelOptions, versionOptions }) => (
  <div className="model-selector">
    <Dropdown 
      label="Model Name:"
      options={modelOptions}
      value={modelName}
      onChange={setModelName}
    />
    <Dropdown 
      label="Version/Tag:"
      options={versionOptions}
      value={version}
      onChange={setVersion}
    />
  </div>
);

export default ModelSelector;
