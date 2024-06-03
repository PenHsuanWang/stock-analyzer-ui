import React, { useState, useEffect } from 'react';
import { getModelList, compareModels, sendRequest } from '../services/api';
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
  const [modelName1, setModelName1] = useState('');
  const [version1, setVersion1] = useState('');
  const [modelName2, setModelName2] = useState('');
  const [version2, setVersion2] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [error, setError] = useState(null);
  const [modelOptions, setModelOptions] = useState([]);
  const [versionOptions1, setVersionOptions1] = useState([]);
  const [versionOptions2, setVersionOptions2] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [history, setHistory] = useState([]);
  const [modelDetails1, setModelDetails1] = useState(null);
  const [modelDetails2, setModelDetails2] = useState(null);
  const [modelType1, setModelType1] = useState('');
  const [modelType2, setModelType2] = useState('');

  useEffect(() => {
    getModelList()
      .then(response => setModelOptions(response))
      .catch(err => setError(err.message));
  }, []);

  useEffect(() => {
    if (modelName1) {
      const model = modelOptions.find(m => m.name === modelName1);
      if (model) {
        setVersionOptions1(model.latest_versions.map(version => version.version));
      }
    }
  }, [modelName1, modelOptions]);

  useEffect(() => {
    if (modelName2) {
      const model = modelOptions.find(m => m.name === modelName2);
      if (model) {
        setVersionOptions2(model.latest_versions.map(version => version.version));
      }
    }
  }, [modelName2, modelOptions]);

  const handleCompare = async () => {
    try {
      const response = await compareModels(modelName1, version1, modelName2, version2);
      setComparisonResult(response);
      setError(null);
    } catch (err) {
      setError(`Backend error: ${err.message}`);
      setComparisonResult(null);
    }
  };

  const fetchModelDetails = async (modelName, version, setModelDetails, setModelType) => {
    try {
      const response = await sendRequest('get', `/mlflow/models/details/${modelName}/${version}`);
      setModelDetails(response);
      setModelType(response.details.model_type); // Assuming model_type is included in the response
      setError(null);
    } catch (err) {
      setError(`Backend error: ${err.message}`);
    }
  };

  useEffect(() => {
    if (modelName1 && version1) {
      fetchModelDetails(modelName1, version1, setModelDetails1, setModelType1);
    }
  }, [modelName1, version1]);

  useEffect(() => {
    if (modelName2 && version2) {
      fetchModelDetails(modelName2, version2, setModelDetails2, setModelType2);
    }
  }, [modelName2, version2]);

  const handleFilter = (filter) => {
    const filteredMetrics = metrics.filter(metric => metric.name.includes(filter));
    setMetrics(filteredMetrics);
  };

  const handleSort = (sort) => {
    const sortedMetrics = [...metrics].sort((a, b) => (a[sort] > b[sort] ? 1 : -1));
    setMetrics(sortedMetrics);
  };

  const handleAdjustParameters = (parameters) => {
    const adjustedMetrics = metrics.map(metric => ({
      ...metric,
      value: metric.value * parameters.adjustmentFactor,
    }));
    setMetrics(adjustedMetrics);
  };

  const handleExport = (format) => {
    const dataToExport = metrics.map(metric => ({
      name: metric.name,
      value: metric.value,
    }));
    // Convert dataToExport to the desired format and trigger download
  };

  const handleGenerateLink = () => {
    const link = `${window.location.origin}/model-comparison?model1=${modelName1}&version1=${version1}&model2=${modelName2}&version2=${version2}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="model-comparison-page">
      <Header title="Model Comparison" description="Compare different versions or tags of machine learning models." />
      <ModelComparisonHeader />
      <div className="model-selection">
        <ModelSelector 
          modelName={modelName1} 
          setModelName={setModelName1} 
          version={version1} 
          setVersion={setVersion1} 
          modelOptions={modelOptions.map(model => model.name)} 
          versionOptions={versionOptions1} 
        />
        <ModelSelector 
          modelName={modelName2} 
          setModelName={setModelName2} 
          version={version2} 
          setVersion={setVersion2} 
          modelOptions={modelOptions.map(model => model.name)} 
          versionOptions={versionOptions2} 
        />
      </div>

      <div className="model-details">
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
  );
};

export default ModelComparisonPage;
