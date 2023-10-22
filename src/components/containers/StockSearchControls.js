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
      <div className="stockInputs">
        <input
          type="text"
          value={stockId}
          onChange={(e) => setStockId(e.target.value)}
          placeholder="Stock ID (e.g., AAPL)"
        />
      </div>
      <div className="dateInputs">
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
      </div>
      <div>
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default StockSearchControls;
