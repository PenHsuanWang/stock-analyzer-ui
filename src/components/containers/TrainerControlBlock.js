// src/components/containers/TrainerControlBlock.js
import React, { useState, useEffect } from 'react';
import { getDataProcessorList, getModelForTrainerList, getTrainerList, startTraining } from '../../services/api';
import '../../styles/TrainerControlBlock.css';

const TrainerControlBlock = ({ analyzedDataPrefix }) => {
  const [dataProcessors, setDataProcessors] = useState([]);
  const [models, setModels] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [selectedDataProcessorId, setSelectedDataProcessorId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedTrainerId, setSelectedTrainerId] = useState('');
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataProcessorList = await getDataProcessorList();
        setDataProcessors(dataProcessorList.data_processors);

        const modelList = await getModelForTrainerList();
        setModels(modelList.models);

        const trainerList = await getTrainerList();
        setTrainers(trainerList.trainers);
      } catch (error) {
        console.error('Error fetching data processors, models, and trainers:', error);
      }
    };

    fetchData();
  }, []);

  const handleStartTraining = async () => {
    setIsLoading(true);
    try {
      const response = await startTraining({
        data_processor_id: selectedDataProcessorId,
        model_id: selectedModelId,
        trainer_id: selectedTrainerId,
        prefix: analyzedDataPrefix
      });
      setStatus({ message: response.message, type: 'success' });
    } catch (error) {
      setStatus({ message: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="trainer-control-block">
      <h3>Start Training</h3>
      <div className="form-group">
        <label>Select Data Processor:</label>
        <select value={selectedDataProcessorId} onChange={(e) => setSelectedDataProcessorId(e.target.value)}>
          <option value="">Select Data Processor</option>
          {dataProcessors.map((processor) => (
            <option key={processor} value={processor}>
              {processor}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Select Model:</label>
        <select value={selectedModelId} onChange={(e) => setSelectedModelId(e.target.value)}>
          <option value="">Select Model</option>
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Select Trainer:</label>
        <select value={selectedTrainerId} onChange={(e) => setSelectedTrainerId(e.target.value)}>
          <option value="">Select Trainer</option>
          {trainers.map((trainer) => (
            <option key={trainer} value={trainer}>
              {trainer}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleStartTraining} disabled={isLoading || !selectedDataProcessorId || !selectedModelId || !selectedTrainerId}>
        {isLoading ? 'Starting training...' : 'Start Training'}
      </button>
      {status && <p className={`status ${status.type}`}>{status.message}</p>}
    </div>
  );
};

export default TrainerControlBlock;