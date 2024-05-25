import React, { useState, useEffect } from 'react';
import { getListDatasetFromDB, sendRequest } from '../services/api';
import Header from '../components/basic/Header';
import ModelSelector from '../components/containers/ModelSelector';
import ComparisonTable from '../components/containers/ComparisonTable';
import ModelComparisonHeader from '../components/containers/ModelComparisonHeader';  // Correct path
import MetricsComparison from '../components/containers/MetricsComparison';
import TestModelPerformance from '../components/containers/TestModelPerformance';
import HistoricalComparison from '../components/containers/HistoricalComparison';
import InteractiveAnalysis from '../components/containers/InteractiveAnalysis';
import ExportAndShare from '../components/containers/ExportAndShare';
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

  useEffect(() => {
    // Fetch model options when the component mounts
    getListDatasetFromDB()
      .then(response => setModelOptions(response.map(model => model.name)))
      .catch(err => setError(err.message));
  }, []);

  useEffect(() => {
    // Fetch version options for the first model
    if (modelName1) {
      getListDatasetFromDB({ modelName: modelName1 })
        .then(response => setVersionOptions1(response))
        .catch(err => setError(err.message));
    }
  }, [modelName1]);

  useEffect(() => {
    // Fetch version options for the second model
    if (modelName2) {
      getListDatasetFromDB({ modelName: modelName2 })
        .then(response => setVersionOptions2(response))
        .catch(err => setError(err.message));
    }
  }, [modelName2]);

  const handleCompare = async () => {
    try {
      const response = await sendRequest('get', `/mlflow/models/compare/${modelName1}/${version1}/${modelName2}/${version2}`);
      setComparisonResult(response);
      setMetrics(response.metrics); // Set metrics data
      setError(null);
    } catch (err) {
      setError(err.message);
      setComparisonResult(null);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await sendRequest('get', `/mlflow/models/metrics/${modelName1}/${version1}/${modelName2}/${version2}`);
      setMetrics(response);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await sendRequest('get', `/mlflow/models/history/${modelName1}/${version1}/${modelName2}/${version2}`);
      setHistory(response);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilter = (filter) => {
    // Implement filter logic
    const filteredMetrics = metrics.filter(metric => metric.name.includes(filter));
    setMetrics(filteredMetrics);
  };

  const handleSort = (sort) => {
    // Implement sort logic
    const sortedMetrics = [...metrics].sort((a, b) => (a[sort] > b[sort] ? 1 : -1));
    setMetrics(sortedMetrics);
  };

  const handleAdjustParameters = (parameters) => {
    // Implement parameter adjustments
    // Example: Adjust learning rate or batch size and refetch metrics
    const adjustedMetrics = metrics.map(metric => ({
      ...metric,
      value: metric.value * parameters.adjustmentFactor,
    }));
    setMetrics(adjustedMetrics);
  };

  const handleExport = (format) => {
    // Implement export logic
    // Example: Export metrics data to a CSV or PDF file
    const dataToExport = metrics.map(metric => ({
      name: metric.name,
      value: metric.value,
    }));
    // Convert dataToExport to the desired format and trigger download
  };

  const handleGenerateLink = () => {
    // Implement link generation logic
    // Example: Generate a shareable link for the current comparison
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
          modelOptions={modelOptions} 
          versionOptions={versionOptions1} 
        />
        <ModelSelector 
          modelName={modelName2} 
          setModelName={setModelName2} 
          version={version2} 
          setVersion={setVersion2} 
          modelOptions={modelOptions} 
          versionOptions={versionOptions2} 
        />
      </div>
      <button onClick={handleCompare}>Compare Models</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ComparisonTable comparisonResult={comparisonResult} />
      <MetricsComparison metrics={metrics} />
      <TestModelPerformance />
      <HistoricalComparison history={history} />
      <InteractiveAnalysis onFilter={handleFilter} onSort={handleSort} onAdjustParameters={handleAdjustParameters} />
      <ExportAndShare onExport={handleExport} onGenerateLink={handleGenerateLink} />
    </div>
  );
};

export default ModelComparisonPage;
