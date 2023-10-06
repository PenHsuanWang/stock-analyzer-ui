import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { fetchData, fetchMaChartData } from '../components/dataService';

function StockDiagram() {
  const [chartData, setChartData] = useState([]);
  const [stockId, setStockId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const layout = {
    title: 'Basic Plotly Line Chart',
    xaxis: {
      title: 'X Axis Label',
    },
    yaxis: {
      title: 'Y Axis Label',
    },
  };

  useEffect(() => {
    const fetchDataAndMa = async () => {
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

    fetchDataAndMa();
  }, [stockId, startDate, endDate]);

  return (
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

      <Plot
        data={chartData}
        layout={layout}
        style={{ width: '80%', height: '400px' }}
      />
    </div>
  );
}

export default StockDiagram;
