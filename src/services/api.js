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
    // to do additional error handling if needed
    throw error;
  }
};

// create function for components
export const fetchDataFromSource = (payload) => sendRequest('post', '/stock_data/fetch_and_get_as_dataframe', payload);
export const fetchAndStashData = (payload) => sendRequest('post', '/stock_data/fetch_and_stash', payload);
export const fetchFullAnalysis = (payload) => sendRequest('post', '/stock_analyzer/full_analysis', payload);
export const getListDatasetFromDB = () => sendRequest('get', '/stock_data/get_all_keys');
export const deleteDatasetInDB = (datasetName) => sendRequest('delete', '/stock_data/delete', { dataset_name: datasetName });
