import React, { useState } from 'react';
import BasePage from './BasePage';
import Header from '../components/basic/Header';
import TrainerSelectorPanel from '../components/containers/TrainerSelectorPanel';
import TrainingMonitorChart from '../components/charts/TrainingMonitorChart';
import '../styles/TrainerControlPage.css';

const TrainerControlPage = () => {
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const handleTrainerSelect = (trainerId) => {
    setSelectedTrainer(trainerId);
  };

  return (
    <BasePage>
      <Header title="Trainer Control Panel" />
      <div className="trainer-control-page">
        <div className="left-panel">
          <TrainerSelectorPanel onTrainerSelect={handleTrainerSelect} />
        </div>
        <div className="right-panel">
          <TrainingMonitorChart selectedTrainer={selectedTrainer} />
        </div>
      </div>
    </BasePage>
  );
};

export default TrainerControlPage;