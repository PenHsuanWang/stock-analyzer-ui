import React, { useState, useEffect } from 'react';
import { getListDatasetFromDB, sendRequest } from '../services/api'; // Ensure sendRequest is imported
import Header from '../components/basic/Header';
import ModelSelector from '../components/containers/ModelSelector';
import ComparisonTable from '../components/containers/ComparisonTable';
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
      setError(null);
    } catch (err) {
      setError(err.message);
      setComparisonResult(null);
    }
  };

  return (
    <div className="model-comparison-page">
      <Header title="Model Comparison" description="Compare different versions or tags of machine learning models." />
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
    </div>
  );
};

export default ModelComparisonPage;
