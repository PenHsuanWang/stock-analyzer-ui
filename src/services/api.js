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

// General base send request function for stock data backend
const sendRequestStockData = async (method, path, payload = {}, params = {}) => {
  try {
    const response = await apiClientStockData({
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

// General base send request function for ML system backend
const sendRequestMlSystem = async (method, path, payload = {}, params = {}) => {
  try {
    const response = await apiClientMlSystem({
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

// Handle request errors
const handleRequestError = (error) => {
  if (error.response) {
    throw new Error(`Backend error: ${error.response.status} ${error.response.data.message}`);
  } else if (error.request) {
    throw new Error('No response from the server. Please check your network connection.');
  } else {
    throw new Error(`Error setting up the request: ${error.message}`);
  }
};

// Exported API functions for stock data backend
export const fetchDataFromSource = (payload) => sendRequestStockData('post', '/stock_data/fetch_and_get_as_dataframe', payload);
export const getListDatasetFromDB = (payload) => sendRequestStockData('post', '/stock_data/get_all_keys', payload);
export const deleteDatasetInDB = (payload) => sendRequestStockData('post', '/stock_data/delete_data', payload);
export const computeFullAnalysisAndStore = (payload) => sendRequestStockData('post', '/stock_data/compute_full_analysis_and_store', payload);
export const fetchDataFromBackendDB = (payload) => sendRequestStockData('post', '/stock_data/get_data', payload);
export const computeAssetsCorrelation = (payload) => sendRequestStockData('post', '/stock_data/calculate_correlation', payload);

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

// Exported API functions for ML system backend
export const setDataFetcher = async (dataFetcherName) => {
  const response = await apiClientMlSystem.post('/ml_training_manager/set_data_fetcher', { data_fetcher_name: dataFetcherName });
  return response.data;
};

export const initDataProcessor = async (params) => {
  const response = await apiClientMlSystem.post('/ml_training_manager/init_data_processor_from_df', params);
  return response.data;
};

export const initModel = async (params) => {
  const response = await apiClientMlSystem.post('/ml_training_manager/init_model', params);
  return response.data;
};

export const initTrainer = async (params) => {
  const response = await apiClientMlSystem.post('/ml_training_manager/init_trainer', params);
  return response.data;
};

export const runMLTraining = async (params) => {
  const response = await apiClientMlSystem.post('/ml_training_manager/run_ml_training', params);
  return response.data;
};

export const getDataFetcher = () => sendRequestMlSystem('get', '/ml_training_manager/get_data_fetcher');
export const getDataProcessor = (processorId) => sendRequestMlSystem('get', `/ml_training_manager/get_data_processor/${processorId}`);
export const getModel = (modelId) => sendRequestMlSystem('get', `/ml_training_manager/get_model/${modelId}`);
export const getTrainer = (trainerId) => sendRequestMlSystem('get', `/ml_training_manager/get_trainer/${trainerId}`);
export const getModelForTrainerList = () => sendRequestMlSystem('get', '/ml_training_manager/list_models');
export const getTrainerList = () => sendRequestMlSystem('get', '/ml_training_manager/list_trainers');
export const getDataProcessorList = () => sendRequestMlSystem('get', '/ml_training_manager/list_data_processors');
export const getDataFetcherList = () => sendRequestMlSystem('get', '/ml_training_manager/list_data_fetchers');

// Function for file upload testing
export const runTest = async (formData) => {
  const response = await axios.post('/api/runTest', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Additional functions for model management and comparison
export const getModelList = () => sendRequestMlSystem('get', '/mlflow/models');
export const compareModels = (model1, version1, model2, version2) => 
  sendRequestMlSystem('get', `/mlflow/models/compare/${model1}/${version1}/${model2}/${version2}`);

// General sendRequest function
export const sendRequest = async (method, path, payload = {}, params = {}) => {
  const response = await apiClientMlSystem({
    method,
    url: path,
    data: JSON.stringify(payload),
    params,
  });
  return response.data;
};
