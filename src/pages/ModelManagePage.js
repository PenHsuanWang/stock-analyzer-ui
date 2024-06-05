import React, { useState, useEffect } from 'react';
import { getModelList, sendRequest } from '../services/api';
import BasePage from './BasePage';
import Header from '../components/basic/Header';
import ModelListTable from '../components/lists/ModelListTable';
import ModelDetails from '../components/containers/ModelDetails';
import '../styles/ModelManagePage.css';

const ModelManagePage = () => {
  const [modelOptions, setModelOptions] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [modelDetails, setModelDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getModelList()
      .then(response => setModelOptions(response))
      .catch(err => setError(err.message));
  }, []);

  const fetchModelDetails = async (modelName, version) => {
    try {
      const response = await sendRequest('get', `/mlflow/models/details/${modelName}/${version}`);
      setModelDetails(response);
      setError(null);
    } catch (err) {
      setError(`Backend error: ${err.message}`);
    }
  };

  const handleModelSelection = (model, version) => {
    setSelectedModel(model);
    setSelectedVersion(version);
    fetchModelDetails(model, version);
  };

  return (
    <BasePage>
      <div className="model-manage-page">
        <Header title="Model Management" description="Manage and view details of machine learning models." />
        <ModelListTable models={modelOptions} onSelectModel={handleModelSelection} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {modelDetails && <ModelDetails model={modelDetails} />}
      </div>
    </BasePage>
  );
};

export default ModelManagePage;
