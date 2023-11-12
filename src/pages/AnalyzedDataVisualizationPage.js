// src/pages/AnalyzedDataVisualizationPage.js
import React, { useState } from 'react';
import BasePage from './BasePage';
import ListDatasetFromDBControls from '../components/containers/ListDatasetFromDBControls';
import TwoDHeatmapDiagram from '../components/charts/TwoDHeatmapDiagram';
import CandlestickDiagram from '../components/charts/CandlestickDiagram';
import HistogramDiagram from '../components/charts/HistogramDiagram';
import { computeAssetsCorrelation, fetchDataFromBackendDB } from '../services/api';
import '../styles/AnalyzedDataVisualizationPage.css';

function AnalyzedDataVisualizationPage({ analyzedDataPrefix, chartType }) {

  const [visualizationData, setVisualizationData] = useState([]);
  const [selectedForVisualization, setSelectedForVisualization] = useState([]);
  const [refreshAnalyzedDataKey, setRefreshAnalyzedDataKey] = useState(0)

  // Function to handle the display of the selected data visualization
  const handleShowData = async () => {
    if (chartType === 'heatmap') {
      const stockIds = selectedForVisualization.map(item => item.stock_id);
      const startDate = selectedForVisualization[0]?.start_date;
      const endDate = selectedForVisualization[0]?.end_date;
      const correlation_colume = "Daily_Return";

      // Ensure all selected datasets have the same start and end date
      if (!selectedForVisualization.every(item => item.start_date === startDate && item.end_date === endDate)) {
        console.error("Error: Start dates or end dates do not match.");
        return;
      }

      try {
        const correlationData = await computeAssetsCorrelation({
          stock_ids: stockIds,
          start_date: startDate,
          end_date: endDate,
          metric: correlation_colume
        });
        // Assuming the backend returns data in the structure we expect
        // Otherwise, we would transform it to fit what TwoDHeatmapDiagram expects
        setVisualizationData(correlationData);
      } catch (error) {
        console.error("Error fetching heatmap data:", error);
        setVisualizationData([]);
      }
    } else if (chartType === 'candlestick') {
      const promises = selectedForVisualization.map(item =>
        fetchDataFromBackendDB({
          prefix: analyzedDataPrefix,
          stock_id: item.stock_id,
          start_date: item.start_date,
          end_date: item.end_date
        })
      );

      try {
        const datasets = await Promise.all(promises);
        const transformedDatasets = datasets.map((response, index) => {
          if (!response || !Array.isArray(response.data)) {
            throw new Error('Response does not contain a data array');
          }
          const data = response.data;
          const startDate = new Date(selectedForVisualization[index].start_date);
          return data.map((dataPoint, valueIndex) => {
            const date = new Date(startDate);
            date.setDate(date.getDate() + valueIndex);
            return {
              ...dataPoint,
              Date: date.toISOString().split('T')[0]
            };
          });
        });

        setVisualizationData(transformedDatasets);
      } catch (error) {
        console.error("Error fetching candlestick data:", error);
        setVisualizationData([]);
      }
    } else if (chartType === 'histogram') {
      const promises = selectedForVisualization.map(item =>
        fetchDataFromBackendDB({
            prefix: analyzedDataPrefix,
            stock_id: item.stock_id,
            start_date: item.start_date,
            end_date: item.end_date
        })
      );

      try {
          const datasets = await Promise.all(promises);
          const histogramData = datasets.map(dataset => {
              // collects daily return data into global
              return dataset.data.map(dataPoint => dataPoint.Daily_Return);
          }).flat();
          console.log(histogramData)
          setVisualizationData(histogramData);
      } catch (error) {
          console.error("Error fetching histogram data:", error);
          setVisualizationData([]);
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
    if (chartType === 'heatmap' && visualizationData) {
      return <TwoDHeatmapDiagram data={visualizationData} />;
    } else if (chartType === 'candlestick') {
      return visualizationData.map((dataSet, index) => (
        <CandlestickDiagram key={index} data={dataSet} />
      ));
    } else if (chartType === 'histogram') {
      return <HistogramDiagram data={visualizationData} />;
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
        <div className="analyzed-data-visualization-container">
          {renderVisualization()}
        </div>
      </div>
    </BasePage>
  );
}

export default AnalyzedDataVisualizationPage;
