// components/containers/StockSearchControls.js
import React, { useState } from 'react';
import { fetchData, fetchMaChartData } from '../../services/dataService';
import '../../styles/StockSearchControls.css';

const StockSearchControls = ({ setChartData }) => {
  const [stockId, setStockId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSearch = async () => {
    try {
      const [chartDataResponse, maChartDataResponse] = await Promise.all([
        fetchData(stockId, startDate, endDate),
        fetchMaChartData(stockId, startDate, endDate),
      ]);

      setChartData([...chartDataResponse, ...maChartDataResponse]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="StockSearchControls">
      <input
        type="text"
        value={stockId}
        onChange={(e) => setStockId(e.target.value)}
        placeholder="Stock ID (e.g., AAPL)"
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Start Date"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="End Date"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default StockSearchControls;
