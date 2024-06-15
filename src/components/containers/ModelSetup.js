import React, { useState } from 'react';
import { initModel } from '../../services/api';
import '../../styles/ModelSetup.css';

const ModelSetup = ({ onSetupComplete }) => {
  const [modelType, setModelType] = useState('');
  const [inputSize, setInputSize] = useState(2);
  const [hiddenSize, setHiddenSize] = useState(128);
  const [outputSize, setOutputSize] = useState(1);
  const [status, setStatus] = useState(null);

  const handleSetup = async () => {
    try {
      const response = await initModel({
        model_type: modelType,
        input_size: inputSize,
        hidden_size: hiddenSize,
        output_size: outputSize
      });
      setStatus(response.message);
      onSetupComplete();
    } catch (error) {
      setStatus('Error setting up model');
    }
  };

  return (
    <div className="model-setup">
      <h3>Setup Model</h3>
      <input
        type="text"
        value={modelType}
        onChange={(e) => setModelType(e.target.value)}
        placeholder="Enter model type"
      />
      <input
        type="number"
        value={inputSize}
        onChange={(e) => setInputSize(parseInt(e.target.value))}
        placeholder="Enter input size"
      />
      <input
        type="number"
        value={hiddenSize}
        onChange={(e) => setHiddenSize(parseInt(e.target.value))}
        placeholder="Enter hidden size"
      />
      <input
        type="number"
        value={outputSize}
        onChange={(e) => setOutputSize(parseInt(e.target.value))}
        placeholder="Enter output size"
      />
      <button onClick={handleSetup}>Set Model</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default ModelSetup;
