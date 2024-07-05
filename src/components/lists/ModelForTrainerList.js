// src/components/lists/ModelForTrainerList.js
import React, { useState, useEffect } from 'react';
import { getModelForTrainerList, getModel, deleteModel } from '../../services/api';
import '../../styles/ComponentList.css';

const ModelForTrainerList = ({ onSelect, refreshList, onRefreshed }) => {
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  const fetchData = async () => {
    try {
      const modelList = await getModelForTrainerList();
      setModels(modelList.models);
      if (refreshList) {
        onRefreshed();
      }
    } catch (err) {
      setError(err.message || 'No response from the server. Please check your network connection.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshList]);

  const handleSelect = async (model) => {
    if (selectedModel === model) {
      setSelectedModel(null);
      onSelect(null);
    } else {
      setSelectedModel(model);
      try {
        const modelData = await getModel(model);
        if (modelData.model) {
          onSelect(modelData.model);
        } else {
          setError('Failed to fetch model data.');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch model data.');
      }
    }
  };

  const handleDelete = async (model) => {
    try {
      await deleteModel(model);
      fetchData(); // Refresh the list after deletion
    } catch (err) {
      setError(err.message || 'Failed to delete model.');
    }
  };

  return (
    <div className="component-list">
      <h4>Existing Models</h4>
      {error && <p className="error">{error}</p>}
      <ul className="no-bullets">
        {models.map((model) => (
          <li key={model} className="processor-item">
            <label>
              <input
                type="checkbox"
                name="model"
                checked={selectedModel === model}
                onChange={() => handleSelect(model)}
              />
              {model}
            </label>
            <button className="delete-button" onClick={() => handleDelete(model)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModelForTrainerList;

