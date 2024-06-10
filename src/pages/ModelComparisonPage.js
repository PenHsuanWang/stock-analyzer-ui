import React, { useState, useEffect, useCallback } from 'react';
import { getModelList, compareModels, sendRequest } from '../services/api';
import BasePage from './BasePage';
import Header from '../components/basic/Header';
import ModelSelector from '../components/containers/ModelSelector';
import ComparisonTable from '../components/containers/ComparisonTable';
import ModelComparisonHeader from '../components/containers/ModelComparisonHeader';
import MetricsComparison from '../components/containers/MetricsComparison';
import TestModelPerformance from '../components/containers/TestModelPerformance';
import HistoricalComparison from '../components/containers/HistoricalComparison';
import InteractiveAnalysis from '../components/containers/InteractiveAnalysis';
import ExportAndShare from '../components/containers/ExportAndShare';
import ModelDetails from '../components/containers/ModelDetails';
import '../styles/ModelComparisonPage.css';

const ModelComparisonPage = () => {
  const [state, setState] = useState({
    modelName1: '',
    version1: '',
    modelName2: '',
    version2: '',
    comparisonResult: null,
    error: null,
    modelOptions: [],
    versionOptions1: [],
    versionOptions2: [],
    metrics: {},
    history: [],
    modelDetails1: null,
    modelDetails2: null,
    modelType1: '',
    modelType2: ''
  });

  const {
    modelName1,
    version1,
    modelName2,
    version2,
    comparisonResult,
    error,
    modelOptions,
    versionOptions1,
    versionOptions2,
    metrics,
    history,
    modelDetails1,
    modelDetails2,
    modelType1,
    modelType2
  } = state;

  const setPartState = (updates) => setState((prevState) => ({ ...prevState, ...updates }));

  useEffect(() => {
    getModelList()
      .then(response => setPartState({ modelOptions: response }))
      .catch(err => setPartState({ error: err.message }));
  }, []);

  useEffect(() => {
    if (modelName1) {
      const model = modelOptions.find(m => m.name === modelName1);
      if (model) {
        setPartState({ versionOptions1: model.latest_versions.map(version => version.version) });
      }
    }
  }, [modelName1, modelOptions]);

  useEffect(() => {
    if (modelName2) {
      const model = modelOptions.find(m => m.name === modelName2);
      if (model) {
        setPartState({ versionOptions2: model.latest_versions.map(version => version.version) });
      }
    }
  }, [modelName2, modelOptions]);

  const handleCompare = async () => {
    try {
      const response = await compareModels(modelName1, version1, modelName2, version2);
      setPartState({ comparisonResult: response, error: null });
    } catch (err) {
      setPartState({ error: `Backend error: ${err.message}`, comparisonResult: null });
    }
  };

  const fetchModelDetails = useCallback(async (modelName, version, detailKey, typeKey) => {
    try {
      const response = await sendRequest('get', `/mlflow/models/details/${modelName}/${version}`);
      setPartState({ [detailKey]: response, [typeKey]: response.details.model_type, error: null });
    } catch (err) {
      setPartState({ error: `Backend error: ${err.message}` });
    }
  }, []);

  useEffect(() => {
    if (modelName1 && version1) {
      fetchModelDetails(modelName1, version1, 'modelDetails1', 'modelType1');
    }
  }, [modelName1, version1, fetchModelDetails]);

  useEffect(() => {
    if (modelName2 && version2) {
      fetchModelDetails(modelName2, version2, 'modelDetails2', 'modelType2');
    }
  }, [modelName2, version2, fetchModelDetails]);

  const handleFilter = (filter) => {
    const filteredMetrics = metrics.filter(metric => metric.name.includes(filter));
    setPartState({ metrics: filteredMetrics });
  };

  const handleSort = (sort) => {
    const sortedMetrics = [...metrics].sort((a, b) => (a[sort] > b[sort] ? 1 : -1));
    setPartState({ metrics: sortedMetrics });
  };

  const handleAdjustParameters = (parameters) => {
    const adjustedMetrics = metrics.map(metric => ({
      ...metric,
      value: metric.value * parameters.adjustmentFactor
    }));
    setPartState({ metrics: adjustedMetrics });
  };

  const handleExport = (format) => {
    const dataToExport = metrics.map(metric => ({
      name: metric.name,
      value: metric.value
    }));
    // Convert dataToExport to the desired format and trigger download
  };

  const handleGenerateLink = () => {
    const link = `${window.location.origin}/model-comparison?model1=${modelName1}&version1=${version1}&model2=${modelName2}&version2=${version2}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  return (
    <BasePage>
      <div className="model-comparison-page">
        <ModelComparisonHeader />
        <div className="model-selection">
          <ModelSelector 
            modelName={modelName1} 
            setModelName={(name) => setPartState({ modelName1: name })} 
            version={version1} 
            setVersion={(version) => setPartState({ version1: version })} 
            modelOptions={modelOptions.map(model => model.name)} 
            versionOptions={versionOptions1} 
          />
          <ModelSelector 
            modelName={modelName2} 
            setModelName={(name) => setPartState({ modelName2: name })} 
            version={version2} 
            setVersion={(version) => setPartState({ version2: version })} 
            modelOptions={modelOptions.map(model => model.name)} 
            versionOptions={versionOptions2} 
          />
        </div>

        <div className="model-details-container">
          <ModelDetails model={modelDetails1} />
          <ModelDetails model={modelDetails2} />
        </div>

        <button onClick={handleCompare}>Compare Models</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {comparisonResult && (
          <ComparisonTable comparisonResult={comparisonResult} />
        )}
        <MetricsComparison metrics={metrics} />
        <TestModelPerformance />
        <HistoricalComparison history={history} />
        <InteractiveAnalysis onFilter={handleFilter} onSort={handleSort} onAdjustParameters={handleAdjustParameters} />
        <ExportAndShare onExport={handleExport} onGenerateLink={handleGenerateLink} />
      </div>
    </BasePage>
  );
};

export default ModelComparisonPage;
