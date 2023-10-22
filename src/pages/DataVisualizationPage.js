// DataVisualizationPage.js
import React, { useState } from 'react';
import BasePage from './BasePage';

function DataVisualizationPage({ ChartComponent, ControlComponent }) {
  const [chartData, setChartData] = useState([]);

  return (
    <BasePage>
      {ControlComponent && <ControlComponent setChartData={setChartData} />}
      {ChartComponent && <ChartComponent data={chartData} />}
    </BasePage>
  );
}

export default DataVisualizationPage;
