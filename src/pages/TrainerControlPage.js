// src/pages/TrainerControlPage.js
import React, { useState } from 'react';
import BasePage from './BasePage';
import Header from '../components/basic/Header';
import TrainerSelectorPanel from '../components/containers/TrainerSelectorPanel';
import TrainingMonitorChart from '../components/charts/TrainingMonitorChart';
import '../styles/TrainerControlPage.css';

const TrainerControlPage = () => {
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const handleTrainerSelect = (trainerDetails) => {
    setSelectedTrainer(trainerDetails);
  };

  return (
    <BasePage>
      <Header title="Trainer Control Panel" />
      <div className="trainer-control-page-vertical">
        <TrainerSelectorPanel onTrainerSelect={handleTrainerSelect} />
        <TrainingMonitorChart selectedTrainer={selectedTrainer} />
      </div>
    </BasePage>
  );
};

export default TrainerControlPage;
