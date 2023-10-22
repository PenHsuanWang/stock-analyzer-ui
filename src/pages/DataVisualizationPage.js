// DataVisualizationPage.js
import React, { useState } from 'react';
import BasePage from './BasePage';
import '../styles/DataVisualizationPage.css'

function DataVisualizationPage({ ChartComponent, ControlComponent }) {
  const [chartData, setChartData] = useState([]);

  return (
    <BasePage>
      <div className="main-content-ma-stock-select">
        {ControlComponent && <ControlComponent setChartData={setChartData} />}
      </div>
      <div className="main-content-ma-stock-diagram">
        {ChartComponent && <ChartComponent data={chartData} />}
      </div>
    </BasePage>
  );
}

export default DataVisualizationPage;
