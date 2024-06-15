import axios from 'axios';

// setup base URL
const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// implement general base send request function, which can be reused
export const sendRequest = async (method, path, payload = {}, params = {}) => {
  try {
    const response = await apiClient({
      method,
      url: path,
      data: JSON.stringify(payload),
      params,
    });
    // parse returned data in string format
    if (typeof response.data === 'string') {
      return JSON.parse(response.data);
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(`Backend error: ${error.response.status} ${error.response.data.message}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from the server. Please check your network connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up the request:', error.message);
    }
  }
};

export const runTest = async (formData) => {
  const response = await axios.post('/api/runTest', formData, {
      headers: {
          'Content-Type': 'multipart/form-data'
      }
  });
  return response.data;
};

// create functions for components
export const fetchDataFromSource = (payload) => sendRequest('post', '/stock_data/fetch_and_get_as_dataframe', payload);
export const getListDatasetFromDB = (payload) => sendRequest('post', '/stock_data/get_all_keys', payload);
export const deleteDatasetInDB = (payload) => sendRequest('post', '/stock_data/delete_data', payload);
export const computeFullAnalysisAndStore = (payload) => sendRequest('post', '/stock_data/compute_full_analysis_and_store', payload);
export const fetchDataFromBackendDB = (payload) => sendRequest('post', '/stock_data/get_data', payload);
export const computeAssetsCorrelation = (payload) => sendRequest('post', '/stock_data/calculate_correlation', payload);
export const exportDataFromDB = async (url, data, mode) => {
  if (mode === 'http') {
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // Timeout set for 10 seconds
      });

      // Handle successful response here, perhaps returning it
      console.log("Data sent successfully: ", response.data);
      return response.data;  // Returning the successful response data

    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(`HTTP ${error.response.status}: ${error.response.data.message}`);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        throw new Error("No response was received from the server.");
      } else if (error.code === 'ECONNABORTED') {
        // Handle timeout specifically
        throw new Error("Request timed out. Please try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error("Error setting up the request: " + error.message);
      }
    }
  } else if (mode === 'csv') {
    // Logic to handle CSV export if necessary
    // Placeholder for CSV export logic
  }
};

// New function to get the model list
export const getModelList = () => sendRequest('get', '/mlflow/models');

export const compareModels = (model1, version1, model2, version2) => 
  sendRequest('get', `/mlflow/models/compare/${model1}/${version1}/${model2}/${version2}`);

// New functions for ModelTrainingSetupPage components
export const setDataFetcher = async (dataFetcherName) => {
  const response = await apiClient.post('/ml_training_manager/set_data_fetcher', { data_fetcher_name: dataFetcherName });
  return response.data;
};

export const initDataProcessor = async (params) => {
  const response = await apiClient.post('/ml_training_manager/init_data_processor', params);
  return response.data;
};

export const initModel = async (params) => {
  const response = await apiClient.post('/ml_training_manager/init_model', params);
  return response.data;
};

export const initTrainer = async (params) => {
  const response = await apiClient.post('/ml_training_manager/init_trainer', params);
  return response.data;
};

export const runMLTraining = async (params) => {
  const response = await apiClient.post('/ml_training_manager/run_ml_training', params);
  return response.data;
};
