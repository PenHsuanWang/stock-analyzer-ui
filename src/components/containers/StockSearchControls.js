// components/containers/StockSearchControls.js
import React, { useState } from 'react';
import { fetchDataFromSource } from "../../services/api";
import '../../styles/StockSearchControls.css';
import { parseISO, isBefore } from 'date-fns';

const StockSearchControls = ({ setChartData, setSearchParams }) => {
  const [stockId, setStockId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');

    // Validate inputs
    if (!stockId || !startDate || !endDate) {
      setError('Please enter all fields: Stock ID, Start Date, and End Date.');
      return;
    }

    // Check if start date is before end date
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    if (isBefore(end, start)) {
      setError('The start date must be before the end date.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        stock_id: stockId,
        start_date: startDate,
        end_date: endDate,
      };
      const chartDataResponse = await fetchDataFromSource(payload);
      
      // Backend now returns data with Date field, no need to add dates
      setChartData(chartDataResponse);

      // Update search parameters after successful data fetch
      setSearchParams({ stockId, startDate, endDate });

    } catch (error) {
      console.error("Error fetching data:", error);
      setError(`Failed to fetch data: ${error.message || 'Please try again later.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="StockSearchControls">
      {error && <div className="error-message">{error}</div>}
      <div className="stockInputs">
        <input
          type="text"
          value={stockId}
          onChange={(e) => setStockId(e.target.value)}
          placeholder="Stock ID (e.g., AAPL)"
          disabled={isLoading}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
          disabled={isLoading}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
          disabled={isLoading}
        />
        <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Search'}
        </button>
      </div>
    </div>
  );
};

export default StockSearchControls;
