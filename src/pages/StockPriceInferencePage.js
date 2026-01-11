// src/pages/StockPriceInferencePage.js
import React, { useState } from 'react';
import StockSearchControls from '../components/containers/StockSearchControls';
import PriceInferenceChart from '../components/charts/PriceInferenceChart';
import CandlestickDiagram from '../components/charts/CandlestickDiagram';
import { fetchStockData, runLSTMPrediction } from '../services/api';

const StockPriceInferencePage = () => {
  const [stockData, setStockData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  
  const handleStockSearch = async (stock) => {
    try {
      const data = await fetchStockData(stock);
      setStockData(data);
      setSelectedStock(stock);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const handlePrediction = async () => {
    try {
      if (selectedStock) {
        const result = await runLSTMPrediction(selectedStock);
        setPredictionData(result);
      }
    } catch (error) {
      console.error("Error running LSTM prediction:", error);
    }
  };

  return (
    <div className="stock-price-inference-page">
      <h2>Stock Price Prediction</h2>
      <div className="prediction-page-container">
        <div className="search-and-predict">
          <StockSearchControls onSearch={handleStockSearch} />
          <button onClick={handlePrediction} disabled={!selectedStock}>
            Predict
          </button>
        </div>
        {stockData && <CandlestickDiagram data={stockData} />}
        {predictionData && <PriceInferenceChart data={predictionData} />}
      </div>
    </div>
  );
};

export default StockPriceInferencePage;
