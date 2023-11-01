// StockSearchControls.js
import React, { useState } from 'react';
import { fetchData } from '../../services/dataService';
import '../../styles/StockSearchControls.css';
import { addDays, formatISO, parseISO } from 'date-fns';

const StockSearchControls = ({ setChartData }) => {
  const [stockId, setStockId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSearch = async () => {
    try {
      const chartDataResponse = await fetchData(stockId, startDate, endDate);
      const enrichedData = addDatesToData(chartDataResponse, startDate, endDate);
      setChartData(enrichedData);
    } catch (error) {
      console.error("Error:", error);
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
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default StockSearchControls;
