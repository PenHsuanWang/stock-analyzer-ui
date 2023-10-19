import React from 'react';
import '../../styles/StockSearchControls.css';

const StockSearchControls = ({ stockId, setStockId, startDate, setStartDate, endDate, setEndDate }) => (
  <div>
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
    <button>Search</button>
  </div>
);

export default StockSearchControls;
