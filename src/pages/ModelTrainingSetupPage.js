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
  const [refreshDataProcessorList, setRefreshDataProcessorList] = useState(false);

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
              onSetupComplete={() => setRefreshDataProcessorList(true)}
              analyzedDataPrefix={analyzedDataPrefix} // Pass the analyzedDataPrefix here
            />
          </div>
          <div className="component-list">
            <DataProcessorList
              refreshList={refreshDataProcessorList}
              onRefreshed={() => setRefreshDataProcessorList(false)}
              onSelect={setSelectedDataProcessor} // Pass setSelectedDataProcessor to handle selection
            />
          </div>
        </div>
        <div className="setup-block">
          <div className="setup-form">
            <ModelSetup onSetupComplete={() => {}} />
          </div>
          <div className="component-list">
            <ModelForTrainerList />
          </div>
        </div>
        <div className="setup-block">
          <div className="setup-form">
            <TrainerSetup onSetupComplete={() => {}} />
          </div>
          <div className="component-list">
            <TrainerList />
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
