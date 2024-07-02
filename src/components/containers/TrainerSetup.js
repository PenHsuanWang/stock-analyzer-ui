// src/components/containers/TrainerSetup.js
import React, { useState, useEffect } from 'react';
import { initTrainer, getTrainer, getDataProcessorList, getModelForTrainerList } from '../../services/api';
import '../../styles/TrainerSetup.css';

const TrainerSetup = ({ selectedTrainer, selectedDataProcessor, selectedModel, onSetupComplete }) => {
  const [trainerId, setTrainerId] = useState('');
  const [trainerType, setTrainerType] = useState('torch_nn');
  const [lossFunction, setLossFunction] = useState('mse');
  const [optimizer, setOptimizer] = useState('adam');
  const [learningRate, setLearningRate] = useState(0.001);
  const [device, setDevice] = useState('cpu');
  const [mlflowTrackingUri, setMlflowTrackingUri] = useState('');
  const [mlflowTrackingUsername, setMlflowTrackingUsername] = useState('');
  const [mlflowTrackingPassword, setMlflowTrackingPassword] = useState('');
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [dataProcessors, setDataProcessors] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedDataProcessorId, setSelectedDataProcessorId] = useState(null);
  const [selectedModelId, setSelectedModelId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataProcessorList = await getDataProcessorList();
        setDataProcessors(dataProcessorList.data_processors);

        const modelList = await getModelForTrainerList();
        setModels(modelList.models);
      } catch (error) {
        console.error('Error fetching data processors and models:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTrainer) {
      const fetchTrainer = async () => {
        try {
          const trainer = await getTrainer(selectedTrainer);
          setTrainerId(trainer.trainer_id);
          setTrainerType(trainer.trainer_type);
          setLossFunction(trainer.loss_function);
          setOptimizer(trainer.optimizer);
          setLearningRate(trainer.learning_rate);
          setDevice(trainer.device);
          setMlflowTrackingUri(trainer.mlflow_tracking_uri);
          setMlflowTrackingUsername(trainer.mlflow_tracking_username);
          setMlflowTrackingPassword(trainer.mlflow_tracking_password);
        } catch (error) {
          console.error('Error fetching trainer:', error);
        }
      };

      fetchTrainer();
    }
  }, [selectedTrainer]);

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const response = await initTrainer({
        trainer_type: trainerType,
        trainer_id: trainerId || `trainer_${new Date().getTime()}`, // Use a unique ID if not provided
        kwargs: {
          loss_function: lossFunction,
          optimizer: optimizer,
          learning_rate: learningRate,
          device: device,
          mlflow_tracking_uri: mlflowTrackingUri,
          mlflow_tracking_username: mlflowTrackingUsername,
          mlflow_tracking_password: mlflowTrackingPassword
        }
      });
      setStatus({ message: response.message, type: 'success' });
      onSetupComplete('trainer');
    } catch (error) {
      setStatus({ message: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="trainer-setup">
      <h3>Setup Trainer</h3>
      <input
        type="text"
        value={trainerId}
        onChange={(e) => setTrainerId(e.target.value)}
        placeholder="Enter trainer ID"
      />
      <input
        type="text"
        value={trainerType}
        onChange={(e) => setTrainerType(e.target.value)}
        placeholder="Enter trainer type"
      />
      <input
        type="text"
        value={lossFunction}
        onChange={(e) => setLossFunction(e.target.value)}
        placeholder="Enter loss function"
      />
      <input
        type="text"
        value={optimizer}
        onChange={(e) => setOptimizer(e.target.value)}
        placeholder="Enter optimizer"
      />
      <input
        type="number"
        value={learningRate}
        onChange={(e) => setLearningRate(parseFloat(e.target.value))}
        placeholder="Enter learning rate"
      />
      <input
        type="text"
        value={device}
        onChange={(e) => setDevice(e.target.value)}
        placeholder="Enter device (cpu/cuda)"
      />
      <input
        type="text"
        value={mlflowTrackingUri}
        onChange={(e) => setMlflowTrackingUri(e.target.value)}
        placeholder="Enter MLflow tracking URI"
      />
      <input
        type="text"
        value={mlflowTrackingUsername}
        onChange={(e) => setMlflowTrackingUsername(e.target.value)}
        placeholder="Enter MLflow tracking username"
      />
      <input
        type="password"
        value={mlflowTrackingPassword}
        onChange={(e) => setMlflowTrackingPassword(e.target.value)}
        placeholder="Enter MLflow tracking password"
      />

      <div className="selected-components">
        <h4>Selected Data Processor:</h4>
        <select onChange={(e) => setSelectedDataProcessorId(e.target.value)}>
          <option value="">Select Data Processor</option>
          {dataProcessors.map((processor) => (
            <option key={processor} value={processor}>
              {processor}
            </option>
          ))}
        </select>

        <h4>Selected Model:</h4>
        <select onChange={(e) => setSelectedModelId(e.target.value)}>
          <option value="">Select Model</option>
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleSetup} disabled={isLoading}>
        {isLoading ? 'Setting up...' : 'Set Trainer'}
      </button>
      {status && <p className={`status ${status.type}`}>{status.message}</p>}
    </div>
  );
};

export default TrainerSetup;

