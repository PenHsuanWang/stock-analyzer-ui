// src/services/api.js
import axios from 'axios';

// setup base URL
const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// implement general base send request function, which can be reuse
const sendRequest = async (method, path, payload = {}, params = {}) => {
  try {
    const response = await apiClient({
      method,
      url: path,
      data: payload,
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

// create function for components
export const fetchDataFromSource = (payload) => sendRequest('post', '/stock_data/fetch_and_get_as_dataframe', payload);
export const getListDatasetFromDB = (payload) => sendRequest('post', '/stock_data/get_all_keys', payload);
export const deleteDatasetInDB = (payload) => sendRequest('post', '/stock_data/delete_data', payload);
export const computeFullAnalysisAndStore = (payload) => sendRequest('post', '/stock_data/compute_full_analysis_and_store', payload);
export const fetchDataFromBackendDB = (payload) => sendRequest('post', '/stock_data/get_data', payload)
export const computeAssetsCorrelation = (payload) => sendRequest('post', '/stock_data/calculate_correlation', payload);
