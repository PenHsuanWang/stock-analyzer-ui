import React, { useState, useEffect } from 'react';
import BasePage from './BasePage';
import StockDiagram from '../components/charts/StockDiagram';
import StockSearchControls from '../components/containers/StockSearchControls';
import { fetchData, fetchMaChartData } from '../services/dataService';
import '../styles/DataVisualizationPage.css'

function DataVisualizationPage() {
  const [chartData, setChartData] = useState([]);
  const [stockId, setStockId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

    if (stockId && startDate && endDate) {
      fetchDataAndMa();
    }
  }, [stockId, startDate, endDate]);

  return (
    <BasePage>
      <div className="DataVisualizationPage"> 
        <StockSearchControls
          stockId={stockId}
          setStockId={setStockId}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <StockDiagram data={chartData} />
      </div>
    </BasePage>
  );
}

export default DataVisualizationPage;
