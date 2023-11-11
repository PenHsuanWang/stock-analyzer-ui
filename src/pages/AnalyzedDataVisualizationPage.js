// src/pages/AnalyzedDataVisualizationPage.js
import React, { useState } from 'react';
import BasePage from './BasePage';
import ListDatasetFromDBControls from '../components/containers/ListDatasetFromDBControls';
import TwoDHeatmapDiagram from '../components/charts/TwoDHeatmapDiagram';
import CandlestickDiagram from '../components/charts/CandlestickDiagram';
import { computeAssetsCorrelation, fetchDataFromBackendDB } from '../services/api';
import '../styles/AnalyzedDataVisualizationPage.css';

function AnalyzedDataVisualizationPage({ analyzedDataPrefix, chartType }) {

  // Initialize visualizationData with an empty structure for candlestick chart
  const initialCandlestickData = chartType === 'candlestick' ? [{}] : [];

  // State to track selected items for visualization
  const [selectedForVisualization, setSelectedForVisualization] = useState([]);
  // State to hold heatmap or candlestick data for rendering
  const [visualizationData, setVisualizationData] = useState(initialCandlestickData);
  // State to track refreshes of the ListDatasetFromDBControls
  const [refreshAnalyzedDataKey, setRefreshAnalyzedDataKey] = useState(0);

  // Function to handle the display of the selected data visualization
  const handleShowData = async () => {
    console.log(chartType);
    if (chartType === 'heatmap') {
      // Trigger the computation of correlation for the selected assets
      await handleComputeCorrelation();
    } else if (chartType === 'candlestick') {
      // Fetch and display candlestick data
      const visualizationPromises = selectedForVisualization.map(item =>
        fetchDataFromBackendDB({
          prefix: analyzedDataPrefix,
          stock_id: item.stock_id,
          start_date: item.start_date,
          end_date: item.end_date
        })
      );
  
      try {
        const dataSets = await Promise.all(visualizationPromises);
        // Transform or format dataSets as needed for the CandlestickDiagram component
        // Example: transformDataSets(dataSets);
        setVisualizationData(dataSets); // Update this line as per the transformed data
      } catch (error) {
        console.error("Error fetching candlestick data:", error);
        // Handle errors here, perhaps set an error state to show an error message to the user
      }
    }
  };
  
  // Optional: Add a function to transform/format dataSets for CandlestickDiagram
  const transformDataSets = (dataSets) => {
    // Implement transformation or formatting logic here, if necessary
    return dataSets;
  };

  // Function to handle the computation of correlation for the selected assets
  const handleComputeCorrelation = async () => {
    const stockIds = selectedForVisualization.map(item => item.stock_id);
    const startDate = selectedForVisualization[0]?.start_date;
    const endDate = selectedForVisualization[0]?.end_date;
    const metric = 'Daily_Return'; // or any other metric you want to compute correlation for

    try {
      const correlationMatrix = await computeAssetsCorrelation({
        stock_ids: stockIds,
        start_date: startDate,
        end_date: endDate,
        metric: metric
      });
      setVisualizationData(correlationMatrix);
    } catch (error) {
      console.error("Error computing asset correlation:", error);
      // Handle errors here, perhaps set an error state to show an error message to the user
    }
  };

  // Render the appropriate chart based on chartType
  const renderVisualization = () => {
    console.log(chartType);
    if (chartType === 'heatmap' && visualizationData) {
      return <TwoDHeatmapDiagram data={visualizationData} />;
    } else if (chartType === 'candlestick') {
      // Render an empty chart initially or with data when available
      console.log("going to render CandlestickDiagram")
      console.log(visualizationData)
      return visualizationData.map((dataSets, index) => (
        <CandlestickDiagram key={index} data={dataSets.data} />
      ));
    } else {
      return <p>No data to display.</p>;
    }
  };

  return (
    <BasePage>
      <div className="analyzed-data-visualization-page-container">
        <div className="data-list-container" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <ListDatasetFromDBControls
            key={refreshAnalyzedDataKey}
            prefix={analyzedDataPrefix}
            setSelectedItems={setSelectedForVisualization}
          />
          <button onClick={handleShowData}>Show</button>
        </div>
        <div className="data-visualization-container">
          {renderVisualization()}
        </div>
      </div>
    </BasePage>
  );
}

export default AnalyzedDataVisualizationPage;
