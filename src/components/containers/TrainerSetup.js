// src/components/containers/TrainerSetup.js
import React, { useState, useEffect } from 'react';
import { initTrainer, getTrainer } from '../../services/api';
import '../../styles/TrainerSetup.css';

const TrainerSetup = ({ selectedTrainer, onSetupComplete }) => {
  const [trainerType, setTrainerType] = useState('');
  const [lossFunction, setLossFunction] = useState('mse');
  const [optimizer, setOptimizer] = useState('adam');
  const [learningRate, setLearningRate] = useState(0.001);
  const [device, setDevice] = useState('cpu');
  const [mlflowTrackingUri, setMlflowTrackingUri] = useState('');
  const [mlflowTrackingUsername, setMlflowTrackingUsername] = useState('');
  const [mlflowTrackingPassword, setMlflowTrackingPassword] = useState('');
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedTrainer) {
      const fetchData = async () => {
        try {
          const trainer = await getTrainer(selectedTrainer);
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
      fetchData();
    }
  }, [selectedTrainer]);

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const response = await initTrainer({
        trainer_type: trainerType,
        trainer_id: 'unique_trainer_id',
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
      onSetupComplete();
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
      <button onClick={handleSetup} disabled={isLoading}>
        {isLoading ? 'Setting up...' : 'Set Trainer'}
      </button>
      {status && <p className={`status ${status.type}`}>{status.message}</p>}
    </div>
  );
};

export default TrainerSetup;
