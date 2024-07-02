// src/pages/ModelTrainingSetupPage.js
import React, { useState } from 'react';
import BasePage from './BasePage';
import Header from '../components/basic/Header';
import DataFetcherSetup from '../components/containers/DataFetcherSetup';
import DataProcessorSetup from '../components/containers/DataProcessorSetup';
import ModelSetup from '../components/containers/ModelSetup';
import TrainerSetup from '../components/containers/TrainerSetup';
import TrainingParameters from '../components/containers/TrainingParameters';
import DataFetcherList from '../components/lists/DataFetcherList';
import DataProcessorList from '../components/lists/DataProcessorList';
import ModelForTrainerList from '../components/lists/ModelForTrainerList';
import TrainerList from '../components/lists/TrainerList';
import '../styles/ModelTrainingSetupPage.css';

const ModelTrainingSetupPage = ({ analyzedDataPrefix }) => {
  const [selectedDataProcessor, setSelectedDataProcessor] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [refreshDataProcessorList, setRefreshDataProcessorList] = useState(false);
  const [refreshModelList, setRefreshModelList] = useState(false);
  const [refreshTrainerList, setRefreshTrainerList] = useState(false);

  const handleSetupComplete = (type) => {
    if (type === 'dataProcessor') {
      setRefreshDataProcessorList(true);
      setSelectedDataProcessor(null);
    } else if (type === 'model') {
      setRefreshModelList(true);
      setSelectedModel(null);
    } else if (type === 'trainer') {
      setRefreshTrainerList(true);
      setSelectedTrainer(null);
    }
  };

  return (
    <BasePage>
      <Header title="Model Training Setup" />
      <div className="model-training-setup-page">
        <div className="setup-block">
          <div className="setup-form">
            <DataFetcherSetup onSetupComplete={() => {}} />
          </div>
          <div className="component-list">
            <DataFetcherList />
          </div>
        </div>
        <div className="setup-block">
          <div className="setup-form">
            <DataProcessorSetup
              selectedDataProcessor={selectedDataProcessor}
              onSetupComplete={() => handleSetupComplete('dataProcessor')}
              analyzedDataPrefix={analyzedDataPrefix}
            />
          </div>
          <div className="component-list">
            <DataProcessorList
              refreshList={refreshDataProcessorList}
              onRefreshed={() => setRefreshDataProcessorList(false)}
              onSelect={setSelectedDataProcessor}
            />
          </div>
        </div>
        <div className="setup-block">
          <div className="setup-form">
            <ModelSetup
              selectedModel={selectedModel}
              onSetupComplete={() => handleSetupComplete('model')}
            />
          </div>
          <div className="component-list">
            <ModelForTrainerList
              refreshList={refreshModelList}
              onRefreshed={() => setRefreshModelList(false)}
              onSelect={setSelectedModel}
            />
          </div>
        </div>
        <div className="setup-block">
          <div className="setup-form">
            <TrainerSetup
              selectedTrainer={selectedTrainer}
              selectedDataProcessor={selectedDataProcessor}
              selectedModel={selectedModel}
              onSetupComplete={() => handleSetupComplete('trainer')}
            />
          </div>
          <div className="component-list">
            <TrainerList
              refreshList={refreshTrainerList}
              onRefreshed={() => setRefreshTrainerList(false)}
              onSelect={setSelectedTrainer}
            />
          </div>
        </div>
        <div className="setup-block">
          <div className="setup-form">
            <TrainingParameters onTrainingComplete={() => alert('Training started successfully')} />
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export default ModelTrainingSetupPage;
