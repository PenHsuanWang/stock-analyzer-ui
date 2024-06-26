import React, { useState, useEffect } from 'react';
import { initModel, getModel } from '../../services/api';
import '../../styles/ModelSetup.css';

const ModelSetup = ({ selectedModel, onSetupComplete }) => {
  const [modelType, setModelType] = useState('');
  const [modelName, setModelName] = useState('');  // Add state for model name
  const [inputSize, setInputSize] = useState(2);
  const [hiddenSize, setHiddenSize] = useState(128);
  const [outputSize, setOutputSize] = useState(1);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedModel) {
      const fetchData = async () => {
        try {
          const model = await getModel(selectedModel);
          setModelType(model.model_type);
          setModelName(model.model_id);  // Update modelName from model_id
          setInputSize(model.input_size);
          setHiddenSize(model.hidden_size);
          setOutputSize(model.output_size);
        } catch (error) {
          console.error('Error fetching model:', error);
        }
      };
      fetchData();
    }
  }, [selectedModel]);

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const response = await initModel({
        model_type: modelType,
        model_id: modelName,  // Send model name as model_id
        kwargs: {
          input_size: inputSize,
          hidden_size: hiddenSize,
          output_size: outputSize
        }
      });
      setStatus({ message: response.message, type: 'success' });
      onSetupComplete();
    } catch (error) {
      setStatus({ message: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="model-setup">
      <h3>Setup Model</h3>
      <input
        type="text"
        value={modelName}  // Add input field for model name
        onChange={(e) => setModelName(e.target.value)}
        placeholder="Enter model name"
      />
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
      <button onClick={handleSetup} disabled={isLoading}>
        {isLoading ? 'Setting up...' : 'Set Model'}
      </button>
      {status && <p className={`status ${status.type}`}>{status.message}</p>}
    </div>
  );
};

export default ModelSetup;
