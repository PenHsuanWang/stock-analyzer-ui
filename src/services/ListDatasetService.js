import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export const getListDatasetFromDB = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/stock_data/get_all_keys`);
      
      // Check for the status code and data format
      if (response.status !== 200 || !response.data || !Array.isArray(response.data.keys)) {
        throw new Error(response.data.message || "Unexpected response from the server.");
      }
      
      return response.data.keys;  // Return only the "keys" attribute from the response
    } catch (error) {
      console.error("Error fetching dataset list:", error);
      throw error;
    }
  };
  

export const deleteDatasetInDB = async (datasetName) => {
  try {
    const response = await axios.delete(`${BASE_URL}/stock_data/delete`, { data: { dataset_name: datasetName } });
    if (response.status !== 200) {
      throw new Error(response.data.message || "Unexpected response from the server.");
    }
    return response.data;
  } catch (error) {
    console.error("Error deleting dataset:", error);
    throw error;
  }
};

// You can add other utility functions related to ListDataset if needed.
