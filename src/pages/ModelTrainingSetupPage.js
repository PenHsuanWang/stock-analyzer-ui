import React from 'react';
import BasePage from './BasePage';
import Header from '../components/basic/Header';
import DataFetcherSetup from '../components/containers/DataFetcherSetup';
import DataProcessorSetup from '../components/containers/DataProcessorSetup';
import ModelSetup from '../components/containers/ModelSetup';
import TrainerSetup from '../components/containers/TrainerSetup';
import TrainingParameters from '../components/containers/TrainingParameters';
import '../styles/ModelTrainingSetupPage.css';

const ModelTrainingSetupPage = () => {
  return (
    <BasePage>
      <Header title="Model Training Setup" />
      <div className="model-training-setup-page">
        <DataFetcherSetup onSetupComplete={() => {}} />
        <DataProcessorSetup onSetupComplete={() => {}} />
        <ModelSetup onSetupComplete={() => {}} />
        <TrainerSetup onSetupComplete={() => {}} />
        <TrainingParameters onTrainingComplete={() => alert('Training started successfully')} />
      </div>
    </BasePage>
  );
};

export default ModelTrainingSetupPage;
