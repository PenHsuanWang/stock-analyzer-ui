import React, { useState } from 'react';
import { initTrainer } from '../../services/api';
import '../../styles/TrainerSetup.css';

const TrainerSetup = ({ onSetupComplete }) => {
  const [trainerType, setTrainerType] = useState('');
  const [lossFunction, setLossFunction] = useState('mse');
  const [optimizer, setOptimizer] = useState('adam');
  const [learningRate, setLearningRate] = useState(0.001);
  const [device, setDevice] = useState('cpu');
  const [mlflowTrackingUri, setMlflowTrackingUri] = useState('');
  const [mlflowTrackingUsername, setMlflowTrackingUsername] = useState('');
  const [mlflowTrackingPassword, setMlflowTrackingPassword] = useState('');
  const [status, setStatus] = useState(null);

  const handleSetup = async () => {
    try {
      const response = await initTrainer({
        trainer_type: trainerType,
        loss_function: lossFunction,
        optimizer: optimizer,
        learning_rate: learningRate,
        device: device,
        mlflow_tracking_uri: mlflowTrackingUri,
        mlflow_tracking_username: mlflowTrackingUsername,
        mlflow_tracking_password: mlflowTrackingPassword
      });
      setStatus(response.message);
      onSetupComplete();
    } catch (error) {
      setStatus('Error setting up trainer');
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
      <button onClick={handleSetup}>Set Trainer</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default TrainerSetup;
