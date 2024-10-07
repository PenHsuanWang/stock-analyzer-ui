// src/services/api.js

import axios from 'axios';

// Setup base URLs for the two backend servers
const BASE_URL_STOCK_DATA = process.env.REACT_APP_BACKEND_URL_STOCK_DATA || 'http://localhost:8001';
const BASE_URL_ML_SYSTEM = process.env.REACT_APP_BACKEND_URL_ML_SYSTEM || 'http://localhost:8000';

// Create axios instances for each backend
const apiClientStockData = axios.create({
  baseURL: BASE_URL_STOCK_DATA,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiClientMlSystem = axios.create({
  baseURL: BASE_URL_ML_SYSTEM,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Handle request errors
const handleRequestError = (error) => {
  if (error.response) {
    throw new Error(`Backend error: ${error.response.status} ${error.response.data.message || error.message}`);
  } else if (error.request) {
    throw new Error('No response from the server. Please check your network connection.');
  } else {
    throw new Error(`Error setting up the request: ${error.message}`);
  }
};

// General base send request function
const sendRequest = async (client, method, path, payload = {}, params = {}) => {
  try {
    const response = await client({
      method,
      url: path,
      data: JSON.stringify(payload),
      params,
    });
    return typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

// General base send request function for stock data backend
const sendRequestStockData = async (method, path, payload = {}, params = {}) =>
  sendRequest(apiClientStockData, method, path, payload, params);

// General base send request function for ML system backend
const sendRequestMlSystem = async (method, path, payload = {}, params = {}) =>
  sendRequest(apiClientMlSystem, method, path, payload, params);

/** Stock Data Backend API functions **/
export const fetchDataFromSource = (payload) =>
  sendRequestStockData('post', '/stock_data/fetch_and_get_as_dataframe', payload);

export const getListDatasetFromDB = (payload) =>
  sendRequestStockData('post', '/stock_data/get_all_keys', payload);

export const deleteDatasetInDB = (payload) =>
  sendRequestStockData('post', '/stock_data/delete_data', payload);

export const computeFullAnalysisAndStore = (payload) =>
  sendRequestStockData('post', '/stock_data/compute_full_analysis_and_store', payload);

export const fetchDataFromBackendDB = (payload) =>
  sendRequestStockData('post', '/stock_data/get_data', payload);

export const computeAssetsCorrelation = (payload) =>
  sendRequestStockData('post', '/stock_data/calculate_correlation', payload);

export const exportDataFromDB = async (url, data, mode) => {
  if (mode === 'http') {
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // Timeout set for 10 seconds
      });
      console.log("Data sent successfully: ", response.data);
      return response.data;
    } catch (error) {
      handleRequestError(error);
    }
  } else if (mode === 'csv') {
    // Placeholder for CSV export logic
  }
};

/** ML System Backend API functions **/

// Fetch the list of trainers
export const getTrainerList = () => sendRequestMlSystem('get', '/ml_training_manager/list_trainers');

// Get details of a specific trainer
export const getTrainer = (trainerId) => sendRequestMlSystem('get', `/ml_training_manager/get_trainer/${trainerId}`);

// Initialize data processor from DataFrame
export const initDataProcessor = async (params) => {
  return sendRequestMlSystem('post', '/ml_training_manager/init_data_processor_from_df', params);
};

// Initialize data processor (non-DataFrame version)
export const initDataProcessorSimple = async (params) => {
  return sendRequestMlSystem('post', '/ml_training_manager/init_data_processor', params);
};

// Initialize model
export const initModel = async (params) => {
  return sendRequestMlSystem('post', '/ml_training_manager/init_model', params);
};

// Initialize trainer
export const initTrainer = async (params) => {
  return sendRequestMlSystem('post', '/ml_training_manager/init_trainer', params);
};

// Run machine learning training
export const runMLTraining = async (params) => {
  try {
    const response = await apiClientMlSystem.post('/ml_training_manager/run_ml_training', params);
    return response.data;
  } catch (error) {
    handleRequestError(error);
    throw error; // Ensure the error is thrown so it can be caught in the frontend
  }
};


// Get training progress as an EventSource
export const getTrainingProgress = (trainerId) => {
  const eventSource = new EventSource(`${BASE_URL_ML_SYSTEM}/ml_training_manager/trainers/${trainerId}/progress`);
  return eventSource;
};

// Set data fetcher
export const setDataFetcher = async (dataFetcherName, args = [], kwargs = {}) => {
  const payload = {
    data_fetcher_name: dataFetcherName,
    args,
    kwargs,
  };
  return sendRequestMlSystem('post', '/ml_training_manager/set_data_fetcher', payload);
};

// Fetch data from source (ML system)
export const fetchDataFromSourceML = async (args = [], kwargs = {}) => {
  const payload = {
    args,
    kwargs,
  };
  return sendRequestMlSystem('post', '/ml_training_manager/fetch_data_from_source', payload);
};

// Get data fetcher
export const getDataFetcher = () => sendRequestMlSystem('get', '/ml_training_manager/get_data_fetcher');

// List data fetchers
export const getDataFetcherList = () => sendRequestMlSystem('get', '/ml_training_manager/list_data_fetchers');

// Delete data processor
export const deleteDataProcessor = async (processorId) => {
  return sendRequestMlSystem('delete', `/ml_training_manager/delete_data_processor/${processorId}`);
};

// Delete model
export const deleteModel = async (modelId) => {
  return sendRequestMlSystem('delete', `/ml_training_manager/delete_model/${modelId}`);
};

// Get model for trainer list
export const getModelForTrainerList = () => sendRequestMlSystem('get', '/ml_training_manager/list_models');

// Compare models
export const compareModels = (model1, version1, model2, version2) =>
  sendRequestMlSystem('get', `/mlflow/models/compare/${model1}/${version1}/${model2}/${version2}`);

// Run test (file upload)
export const runTest = async (formData) => {
  const response = await axios.post('/api/runTest', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Set MLflow model name
export const setMLflowModelName = async (modelName) => {
  return sendRequestMlSystem('post', '/ml_training_manager/set_mlflow_model_name', { model_name: modelName });
};

// Set MLflow experiment name
export const setMLflowExperimentName = async (experimentName) => {
  return sendRequestMlSystem('post', '/ml_training_manager/set_mlflow_experiment_name', { experiment_name: experimentName });
};

// Set MLflow run name
export const setMLflowRunName = async (runName) => {
  return sendRequestMlSystem('post', '/ml_training_manager/set_mlflow_run_name', { run_name: runName });
};

// Update model parameters
export const updateModel = async (modelId, params) => {
  return sendRequestMlSystem('put', `/ml_training_manager/update_model/${modelId}`, { params });
};

// Update trainer parameters
export const updateTrainer = async (trainerId, params) => {
  return sendRequestMlSystem('put', `/ml_training_manager/update_trainer/${trainerId}`, { params });
};

// Update data processor parameters
export const updateDataProcessor = async (dataProcessorId, params) => {
  return sendRequestMlSystem('put', `/ml_training_manager/update_data_processor/${dataProcessorId}`, { params });
};

// Delete trainer
export const deleteTrainer = async (trainerId) => {
  return sendRequestMlSystem('delete', `/ml_training_manager/delete_trainer/${trainerId}`);
};

// Get model details
export const getModel = (modelId) => sendRequestMlSystem('get', `/ml_training_manager/get_model/${modelId}`);

// List models
export const getModelList = () => sendRequestMlSystem('get', '/ml_training_manager/list_models');

// Get data processor details
export const getDataProcessor = (dataProcessorId) => sendRequestMlSystem('get', `/ml_training_manager/get_data_processor/${dataProcessorId}`);

// List data processors
export const getDataProcessorList = () => sendRequestMlSystem('get', '/ml_training_manager/list_data_processors');

// General sendRequest function for any other requests
export const sendGeneralRequest = async (method, path, payload = {}, params = {}) => {
  return sendRequest(apiClientMlSystem, method, path, payload, params);
};

// Export the sendRequest function for direct use in other parts of the application
export { sendRequest };
