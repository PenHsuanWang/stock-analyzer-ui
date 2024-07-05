// src/pages/TrainerControlPage.js
import React, { useState, useEffect } from 'react';
import BasePage from './BasePage';
import Header from '../components/basic/Header';
import { getTrainerList, getTrainer, runMLTraining } from '../services/api';
import '../styles/TrainerControlPage.css';

const TrainerControlPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [trainerDetails, setTrainerDetails] = useState(null);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const trainerList = await getTrainerList();
        setTrainers(trainerList.trainers);
      } catch (error) {
        setStatus({ message: error.message, type: 'error' });
      }
    };

    fetchTrainers();
  }, []);

  const handleTrainerSelect = async (trainerId) => {
    setSelectedTrainer(trainerId);
    if (trainerId) {
      try {
        const trainer = await getTrainer(trainerId);
        setTrainerDetails(trainer);
      } catch (error) {
        setStatus({ message: error.message, type: 'error' });
      }
    } else {
      setTrainerDetails(null);
    }
  };

  const handleStartTraining = async () => {
    if (!selectedTrainer) {
      setStatus({ message: 'Please select a trainer to start training', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await runMLTraining({ trainer_id: selectedTrainer });
      setStatus({ message: response.message, type: 'success' });
    } catch (error) {
      setStatus({ message: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BasePage>
      <Header title="Trainer Control Panel" />
      <div className="trainer-control-page">
        <h3>Start Training</h3>
        <div className="trainer-selection">
          <label>Select Trainer:</label>
          <select value={selectedTrainer} onChange={(e) => handleTrainerSelect(e.target.value)}>
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
            <p><strong>Loss Function:</strong> {trainerDetails.loss_function}</p>
            <p><strong>Optimizer:</strong> {trainerDetails.optimizer}</p>
            <p><strong>Learning Rate:</strong> {trainerDetails.learning_rate}</p>
            <p><strong>Device:</strong> {trainerDetails.device}</p>
          </div>
        )}
        <button onClick={handleStartTraining} disabled={isLoading}>
          {isLoading ? 'Starting...' : 'Start Training'}
        </button>
        {status && <p className={`status ${status.type}`}>{status.message}</p>}
      </div>
    </BasePage>
  );
};

export default TrainerControlPage;