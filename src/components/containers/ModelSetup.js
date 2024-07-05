// src/components/containers/ModelSetup.js
import React, { useState, useEffect } from 'react';
import { initModel } from '../../services/api';
import '../../styles/ModelSetup.css';

const ModelSetup = ({ selectedModel, onSetupComplete }) => {
  const [modelType, setModelType] = useState('lstm');
  const [modelName, setModelName] = useState('');
  const [inputSize, setInputSize] = useState(2);
  const [layers, setLayers] = useState([{ hiddenSize: 128 }]);
  const [outputSize, setOutputSize] = useState(1);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedModel) {
      setModelType(selectedModel.model_type || 'lstm');
      setModelName(selectedModel.name || '');
      setInputSize(selectedModel.input_size || 2);
      setLayers((selectedModel.hidden_layer_sizes || [128]).map(size => ({ hiddenSize: size })));
      setOutputSize(selectedModel.output_size || 1);
    } else {
      resetFields();
    }
  }, [selectedModel]);

  const resetFields = () => {
    setModelType('lstm');
    setModelName('');
    setInputSize(2);
    setLayers([{ hiddenSize: 128 }]);
    setOutputSize(1);
  };

  const handleAddLayer = () => {
    setLayers([...layers, { hiddenSize: 128 }]);
  };

  const handleRemoveLayer = (index) => {
    setLayers(layers.filter((_, i) => i !== index));
  };

  const handleLayerChange = (index, key, value) => {
    const newLayers = layers.map((layer, i) => (i === index ? { ...layer, [key]: value } : layer));
    setLayers(newLayers);
  };

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const hiddenLayerSizes = layers.map(layer => layer.hiddenSize);
      const response = await initModel({
        model_type: modelType,
        model_name: modelName,
        kwargs: {
          input_size: inputSize,
          hidden_layer_sizes: hiddenLayerSizes,
          output_size: outputSize
        }
      });
      setStatus({ message: response.message, type: 'success' });
      onSetupComplete('model');
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
        value={modelName}
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
        placeholder="Input size"
      />
      {layers.map((layer, index) => (
        <div key={index} className="layer-input">
          <input
            type="number"
            value={layer.hiddenSize}
            onChange={(e) => handleLayerChange(index, 'hiddenSize', parseInt(e.target.value))}
            placeholder="Hidden size"
          />
          {index !== 0 && (
            <button className="remove-layer" onClick={() => handleRemoveLayer(index)} disabled={layers.length === 1}>-</button>
          )}
        </div>
      ))}
      <button className="add-layer" onClick={handleAddLayer}>+</button>
      <input
        type="number"
        value={outputSize}
        onChange={(e) => setOutputSize(parseInt(e.target.value))}
        placeholder="Output size"
      />
      <button onClick={handleSetup} disabled={isLoading}>
        {isLoading ? 'Setting up...' : 'Set Model'}
      </button>
      {status && <p className={`status ${status.type}`}>{status.message}</p>}
    </div>
  );
};

export default ModelSetup;
