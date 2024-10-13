// src/pages/TrainerControlPage.js

import React, { useState } from 'react';
import BasePage from './BasePage';
import Header from '../components/basic/Header';
import TrainerSelectorPanel from '../components/containers/TrainerSelectorPanel';
import TrainingMonitorChart from '../components/charts/TrainingMonitorChart';
import '../styles/TrainerControlPage.css';

const TrainerControlPage = () => {
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingSessionId, setTrainingSessionId] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleTrainerSelect = (trainerDetails) => {
    setSelectedTrainer(trainerDetails);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleTrainingStatusChange = (status, message = '') => {
    if (status === 'started') {
      setIsTraining(true);
      setSuccessMessage('');
      setErrorMessage('');
      setTrainingSessionId((prevId) => prevId + 1); // Increment trainingSessionId
    } else if (status === 'finished') {
      setIsTraining(false);
      setSuccessMessage('Training completed successfully!');
    } else if (status === 'error') {
      setIsTraining(false);
      setErrorMessage(message || 'An error occurred during training.');
    } else if (status === 'reset') {
      setIsTraining(false);
      setSuccessMessage('');
      setErrorMessage('');
    }
  };

  return (
    <BasePage>
      <Header title="Trainer Control Panel" />
      <div className="trainer-control-page-vertical">
        <TrainerSelectorPanel
          onTrainerSelect={handleTrainerSelect}
          selectedTrainer={selectedTrainer}
          isTraining={isTraining}
          onTrainingStatusChange={handleTrainingStatusChange}
          successMessage={successMessage}
          errorMessage={errorMessage}
        />
        <TrainingMonitorChart
          selectedTrainer={selectedTrainer}
          onTrainingStatusChange={handleTrainingStatusChange}
          trainingSessionId={trainingSessionId} // Pass trainingSessionId
        />
      </div>
    </BasePage>
  );
};

export default TrainerControlPage;
