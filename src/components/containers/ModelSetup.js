import React, { useState, useEffect } from 'react';
import { initModel } from '../../services/api';
import '../../styles/ModelSetup.css';

const ModelSetup = ({ selectedModel, onSetupComplete }) => {
  const [modelType, setModelType] = useState('');
  const [modelName, setModelName] = useState('');
  const [layers, setLayers] = useState([{ inputSize: 2, hiddenSize: 128 }]);
  const [outputSize, setOutputSize] = useState(1);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedModel) {
      setModelType(selectedModel.model_type);
      setModelName(selectedModel.model_id);
      setLayers(selectedModel.hidden_layer_sizes.map(size => ({ hiddenSize: size })));
      setOutputSize(selectedModel.output_size);
    } else {
      resetFields();
    }
  }, [selectedModel]);

  const resetFields = () => {
    setModelType('');
    setModelName('');
    setLayers([{ inputSize: 2, hiddenSize: 128 }]);
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
        model_id: modelName,
        input_size: layers[0].inputSize,
        hidden_layer_sizes: hiddenLayerSizes,
        output_size: outputSize
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
      {layers.map((layer, index) => (
        <div key={index} className="layer-input">
          {index === 0 && (
            <input
              type="number"
              value={layer.inputSize}
              onChange={(e) => handleLayerChange(index, 'inputSize', parseInt(e.target.value))}
              placeholder="Input size"
            />
          )}
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
