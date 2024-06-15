import React, { useState } from 'react';
import { initDataProcessor } from '../../services/api';
import '../../styles/DataProcessorSetup.css';

const DataProcessorSetup = ({ onSetupComplete }) => {
  const [dataProcessorType, setDataProcessorType] = useState('');
  const [extractColumn, setExtractColumn] = useState('');
  const [trainingDataRatio, setTrainingDataRatio] = useState(0.6);
  const [trainingWindowSize, setTrainingWindowSize] = useState(60);
  const [targetWindowSize, setTargetWindowSize] = useState(1);
  const [status, setStatus] = useState(null);

  const handleSetup = async () => {
    try {
      const response = await initDataProcessor({
        data_processor_type: dataProcessorType,
        extract_column: extractColumn.split(','),
        training_data_ratio: trainingDataRatio,
        training_window_size: trainingWindowSize,
        target_window_size: targetWindowSize
      });
      setStatus(response.message);
      onSetupComplete();
    } catch (error) {
      setStatus('Error setting up data processor');
    }
  };

  return (
    <div className="data-processor-setup">
      <h3>Setup Data Processor</h3>
      <input
        type="text"
        value={dataProcessorType}
        onChange={(e) => setDataProcessorType(e.target.value)}
        placeholder="Enter data processor type"
      />
      <input
        type="text"
        value={extractColumn}
        onChange={(e) => setExtractColumn(e.target.value)}
        placeholder="Enter columns to extract (comma separated)"
      />
      <input
        type="number"
        value={trainingDataRatio}
        onChange={(e) => setTrainingDataRatio(parseFloat(e.target.value))}
        placeholder="Enter training data ratio"
      />
      <input
        type="number"
        value={trainingWindowSize}
        onChange={(e) => setTrainingWindowSize(parseInt(e.target.value))}
        placeholder="Enter training window size"
      />
      <input
        type="number"
        value={targetWindowSize}
        onChange={(e) => setTargetWindowSize(parseInt(e.target.value))}
        placeholder="Enter target window size"
      />
      <button onClick={handleSetup}>Set Data Processor</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default DataProcessorSetup;
