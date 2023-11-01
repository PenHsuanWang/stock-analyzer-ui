// components/containers/StockSearchControls.js
import React, { useState } from 'react';
import { fetchDataFromSource } from "../../services/api";
import '../../styles/StockSearchControls.css';
import { addDays, formatISO, parseISO, isBefore } from 'date-fns';

const StockSearchControls = ({ setChartData, setSearchParams }) => {
  const [stockId, setStockId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!stockId || !startDate || !endDate) {
      setError('Please enter all fields: Stock ID, Start Date, and End Date.');
      return;
    }
    
    setError(''); // Clear previous error messages

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

    setIsLoading(true); // Begin loading state

    try {
      const payload = {
        stock_id: stockId,
        start_date: startDate,
        end_date: endDate,
      };
      const chartDataResponse = await fetchDataFromSource(payload);
      const enrichedData = addDatesToData(chartDataResponse, startDate, endDate);
      setChartData(enrichedData);

      // Update search parameters after successful data fetch
      setSearchParams({ stockId, startDate, endDate });

    } catch (error) {
      console.error("Error fetching data:", error);
      setError('Failed to fetch data. Please try again later.'); // Set a user-friendly error message
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  // This function will add dates to the data received from the backend
  const addDatesToData = (data, startDate, endDate) => {
    const startDateParsed = parseISO(startDate);
    const endDateParsed = parseISO(endDate);
    const dateRange = eachDayOfInterval({ start: startDateParsed, end: endDateParsed });
    return data.map((item, index) => {
      return { ...item, Date: formatISO(dateRange[index], { representation: 'date' }) };
    });
  };

  // Generate an array of dates between startDate and endDate
  const eachDayOfInterval = ({ start, end }) => {
    const dayList = [];
    let day = start;
    while (day <= end) {
      dayList.push(day);
      day = addDays(day, 1);
    }
    return dayList;
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
        <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Search'}
        </button>
      </div>
    </div>
  );
};

export default StockSearchControls;
