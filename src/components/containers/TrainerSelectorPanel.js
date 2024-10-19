// src/components/containers/TrainerSelectorPanel.js

import React, { useState, useEffect } from 'react';
import { getTrainerList, getTrainer, runMLTraining } from '../../services/api';
import '../../styles/TrainerSelectorPanel.css';

const TrainerSelectorPanel = ({
  onTrainerSelect,
  selectedTrainer,
  isTraining,
  onTrainingStatusChange,
  successMessage,
  errorMessage,
}) => {
  const [trainers, setTrainers] = useState([]);
  const [trainerDetails, setTrainerDetails] = useState(null);
  const [epochNumber, setEpochNumber] = useState(10); // Default value for epoch number
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const trainerList = await getTrainerList();
        setTrainers(trainerList.trainers);
      } catch (error) {
        console.error('Error fetching trainers:', error);
      }
    };

    fetchTrainers();
  }, []);

  const handleTrainerSelect = async (trainerId) => {
    if (onTrainingStatusChange) {
      onTrainingStatusChange('reset'); // Reset status when selecting a new trainer
    }
    if (trainerId) {
      try {
        const trainer = await getTrainer(trainerId);
        setTrainerDetails(trainer);
        onTrainerSelect(trainer);
      } catch (error) {
        console.error('Error fetching trainer details:', error);
      }
    } else {
      setTrainerDetails(null);
      onTrainerSelect(null);
    }
  };

  const handleRetry = (error) => {
    const errorCode = error.response?.status;
    const backendMessage = error.response?.data?.message;
    const defaultMessage = `Error: ${error.response?.statusText || 'Unknown error'}`;
    const message = backendMessage || defaultMessage;

    if ([422, 404].includes(errorCode)) {
      if (onTrainingStatusChange) {
        onTrainingStatusChange('error', message);
      }
      setRetryCount(0);
    } else if (retryCount < maxRetries) {
      setRetryCount(retryCount + 1);
    } else {
      if (onTrainingStatusChange) {
        onTrainingStatusChange('error', message);
      }
      setRetryCount(0);
    }
  };

  const handleStartTraining = async () => {
    if (!selectedTrainer) return;

    // Start the training and set button state to "Training..."
    if (onTrainingStatusChange) {
      onTrainingStatusChange('started');
    }

    setRetryCount(0);
    try {
      await runMLTraining({
        trainer_id: selectedTrainer.trainer_id || selectedTrainer,
        epochs: epochNumber,
      });
    } catch (error) {
      console.error('Error starting training:', error);
      handleRetry(error);
    }
  };

  return (
    <div className="trainer-selector-panel">
      <h3>Select Trainer</h3>
      <div className="trainer-selection">
        <select
          value={selectedTrainer?.trainer_id || selectedTrainer || ''}
          onChange={(e) => handleTrainerSelect(e.target.value)}
        >
          <option value="">Select Trainer</option>
          {trainers.map((trainer) => (
            <option key={trainer} value={trainer}>
              {trainer}
            </option>
          ))}
        </select>
      </div>
      {trainerDetails && (
        <div className="trainer-details">
          <h4>Trainer Details</h4>
          <p>
            <strong>ID:</strong> {trainerDetails.trainer_id}
          </p>
          <p>
            <strong>Type:</strong> {trainerDetails.trainer_type}
          </p>
          <p>
            <strong>Loss Function:</strong> {trainerDetails.criterion}
          </p>
          <p>
            <strong>Optimizer:</strong> {trainerDetails.optimizer}
          </p>
          <p>
            <strong>Device:</strong> {trainerDetails.device}
          </p>
        </div>
      )}
      <div className="epoch-setting">
        <label htmlFor="epochNumber">Training Epoch Setting:</label>
        <input
          type="number"
          id="epochNumber"
          value={epochNumber}
          onChange={(e) => setEpochNumber(parseInt(e.target.value, 10))}
        />
      </div>
      <button
        onClick={handleStartTraining}
        disabled={isTraining || !selectedTrainer}
        className="start-training-button"
      >
        {isTraining ? 'Training...' : 'Start Training'}
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

export default TrainerSelectorPanel;

