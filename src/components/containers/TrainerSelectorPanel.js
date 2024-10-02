// src/components/containers/TrainerSelectorPanel.js
import React, { useState, useEffect, useCallback } from 'react';
import { getTrainerList, getTrainer, runMLTraining } from '../../services/api';
import '../../styles/TrainerSelectorPanel.css';

const TrainerSelectorPanel = ({ onTrainerSelect }) => {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [trainerDetails, setTrainerDetails] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [epochNumber, setEpochNumber] = useState(10); // Default value for epoch number
  const maxRetries = 3;

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const trainerList = await getTrainerList();
        setTrainers(trainerList.trainers);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };

    fetchTrainers();
  }, []);

  const handleTrainerSelect = async (trainerId) => {
    setSelectedTrainer(trainerId);
    if (trainerId) {
      try {
        const trainer = await getTrainer(trainerId);
        console.log("Fetched trainer details:", trainer); // Log the fetched trainer details
        setTrainerDetails(trainer);
        onTrainerSelect(trainer); // Pass the entire trainer details to the parent component
      } catch (error) {
        console.error("Error fetching trainer details:", error);
        setErrorMessage(`Error fetching trainer details: ${error.message}`);
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
      // Stop retries for these error codes
      setIsTraining(false);
      setRetryCount(0);
      setErrorMessage(message);
    } else if (retryCount < maxRetries) {
      // Retry for other error codes
      setRetryCount(retryCount + 1);
    } else {
      // Stop after max retries
      setIsTraining(false);
      setRetryCount(0);
      setErrorMessage(message);
    }
  };

  const handleStartTraining = async () => {
    if (!selectedTrainer) return;
    setIsTraining(true);
    setRetryCount(0);
    setErrorMessage(null); // Clear previous error message
    setSuccessMessage(null); // Clear previous success message
    try {
      await runMLTraining({ trainer_id: selectedTrainer, epochs: epochNumber });
    } catch (error) {
      console.error("Error starting training:", error);
      handleRetry(error);
    }
  };

  const handleTrainingFinished = useCallback(() => {
    setIsTraining(false);  // Re-enable the button
    setSuccessMessage('Training completed successfully!');  // Show success message
  }, []);
  
  useEffect(() => {
    if (trainerDetails) {
      const eventSource = new EventSource(`http://localhost:8000/ml_training_manager/trainers/${trainerDetails.trainer_id}/progress`);
      
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.message === 'Training finished') {
          handleTrainingFinished();  // Reset button state when training finishes
          eventSource.close();
        } else {
          // Handle other messages like loss updates during training
        }
      };
      
      eventSource.onerror = (error) => {
        console.error('Error with EventSource:', error);
        eventSource.close();
      };
      
      return () => {
        eventSource.close();  // Cleanup
      };
    }
  }, [trainerDetails, handleTrainingFinished]);

  return (
    <div className="trainer-selector-panel">
      <h3>Select Trainer</h3>
      <div className="trainer-selection">
        <select value={selectedTrainer || ''} onChange={(e) => handleTrainerSelect(e.target.value)}>
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
          <p><strong>ID:</strong> {trainerDetails.trainer_id}</p>
          <p><strong>Type:</strong> {trainerDetails.trainer_type}</p>
          <p><strong>Loss Function:</strong> {trainerDetails.criterion}</p>
          <p><strong>Optimizer:</strong> {trainerDetails.optimizer}</p>
          <p><strong>Learning Rate:</strong> {trainerDetails.learning_rate}</p>
          <p><strong>Device:</strong> {trainerDetails.device}</p>
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

