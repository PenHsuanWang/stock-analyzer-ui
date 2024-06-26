// src/components/lists/ModelForTrainerList.js
import React, { useState, useEffect } from 'react';
import { getModelForTrainerList } from '../../services/api';
import '../../styles/ComponentList.css';

const ModelForTrainerList = ({ onSelect, refreshList, onRefreshed }) => {
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);

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

  return (
    <div className="component-list">
      <h4>Existing Models</h4>
      {error && <p className="error">{error}</p>}
      <ul className="no-bullets">
        {models.map((model) => (
          <li key={model}>
            <label>
              <input
                type="radio"
                name="model"
                onChange={() => onSelect(model)}
              />
              {model}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModelForTrainerList;
