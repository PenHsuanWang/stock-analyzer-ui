import React, { useState, useEffect } from 'react';
import { getModelForTrainerList } from '../../services/api';
import '../../styles/ComponentList.css';

const ModelForTrainerList = () => {
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const modelList = await getModelForTrainerList();
        setModels(modelList.models);
      } catch (err) {
        setError(err.message || 'No response from the server. Please check your network connection.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="component-list">
      <h4>Existing Models</h4>
      {error && <p className="error">{error}</p>}
      <ul>
        {models.map((model) => (
          <li key={model}>{model}</li>
        ))}
      </ul>
    </div>
  );
};

export default ModelForTrainerList;
