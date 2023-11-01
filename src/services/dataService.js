// src/services/dataService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // 應根據實際情況調整

export const fetchData = async (stockId, startDate, endDate) => {
  const response = await axios.post(`${BASE_URL}/stock_data/fetch_and_get_as_dataframe`, {
    stock_id: stockId,
    start_date: startDate,
    end_date: endDate,
  });
  const data = JSON.parse(response.data);
  return data; // 返回原始數據
};

export const fetchMaChartData = async (stockId, startDate, endDate) => {
  const fullAnalysisPayload = {
    stock_id: stockId,
    start_date: startDate,
    end_date: endDate,
    window_sizes: [5, 10, 20],
  };
  const response = await axios.post(`${BASE_URL}/stock_analyzer/full_analysis`, fullAnalysisPayload);
  return response.data; // 返回移動平均數據
};
