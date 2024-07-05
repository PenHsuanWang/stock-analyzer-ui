import React, { useState, useEffect } from 'react';
import { getModelForTrainerList, getTrainerList, getDataProcessorList } from '../../services/api';
import '../../styles/ComponentList.css';

const ComponentList = () => {
  const [models, setModels] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [dataProcessors, setDataProcessors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const modelList = await getModelForTrainerList();
        setModels(modelList.models);

        const trainerList = await getTrainerList();
        setTrainers(trainerList.trainers);

        const dataProcessorList = await getDataProcessorList();
        setDataProcessors(dataProcessorList.data_processors);
      } catch (err) {
        setError(err.message || 'No response from the server. Please check your network connection.');
      }
    };

    fetchComponents();
  }, []);

  return (
    <div className="component-list">
      <h3>Existing Components</h3>
      {error && <p className="error">{error}</p>}
      <div>
        <h4>Models</h4>
        <ul>
          {models.map((model) => (
            <li key={model}>{model}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4>Trainers</h4>
        <ul>
          {trainers.map((trainer) => (
            <li key={trainer}>{trainer}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4>Data Processors</h4>
        <ul>
          {dataProcessors.map((processor) => (
            <li key={processor}>{processor}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ComponentList;
