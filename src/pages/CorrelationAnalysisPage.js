import React, { useState } from 'react';
import BasePage from './BasePage';
import ListDatasetFromDBControls from '../components/containers/ListDatasetFromDBControls';
import ScatterAndHistogramChart from '../components/charts/ScatterAndHistogramChart';
import SimpleScatterSimple from '../components/charts/ScatterPlotMatrix';
import ScatterPlotWithHistograms from  '../components/charts/ScatterPlotWithHistograms';
import ScatterPlotWithRegressionLine from '../components/charts/ScatterPlotWithRegressionLine';
import { fetchDataFromBackendDB } from '../services/api';
import '../styles/CorrelationAnalysisPage.css';

function CorrelationAnalysisPage({ prefix }) {
  const [baseDataset, setBaseDataset] = useState(null);
  const [compareDataset, setCompareDataset] = useState(null);
  const [visualizationData, setVisualizationData] = useState([]);

  const handleFetchData = async () => {
    if (baseDataset && compareDataset) {
      try {
        // check the fetched data is valid
        if (!baseDataset.stock_id || !compareDataset.stock_id) {
          console.error("Error: Selected datasets do not contain stock IDs.");
          return;
        }
        if (baseDataset.start_date !== compareDataset.start_date || baseDataset.end_date !== compareDataset.end_date) {
          console.error("Error: Selected datasets have mismatching date ranges.");
          return;
        }
  
        // extract the data from backend
        const baseDataResponse = await fetchDataFromBackendDB({
          prefix: prefix,
          stock_id: baseDataset.stock_id,
          start_date: baseDataset.start_date,
          end_date: baseDataset.end_date
        });
  
        // extract the compared data from backend
        const compareDataResponse = await fetchDataFromBackendDB({
          prefix: prefix,
          stock_id: compareDataset.stock_id,
          start_date: compareDataset.start_date,
          end_date: compareDataset.end_date
        });
  
        const baseDataDailyReturns = baseDataResponse.data.map(item => item.Daily_Return);
        const compareDataDailyReturns = compareDataResponse.data.map(item => item.Daily_Return);
        const correlationData = baseDataDailyReturns.map((item, index) => ({
          x: item,
          y: compareDataDailyReturns[index]
        }));
  

        setVisualizationData(correlationData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setVisualizationData([]); 
      }
    } else {
      console.error("Error: Both datasets must be selected.");
    }
  };

  return (
    <BasePage>
      <div className="correlation-analysis-page-container">
        <div className="data-selection-container">
          <ListDatasetFromDBControls
            prefix={prefix}
            setSelectedItems={(items) => setBaseDataset(items[0])}
          />
          <ListDatasetFromDBControls
            prefix={prefix}
            setSelectedItems={(items) => setCompareDataset(items[0])}
          />
          <button onClick={handleFetchData}>Show Daily Return Scatter Correlation</button>
        </div>
        <div className="data-visualization-container">
          {visualizationData.length > 0 && (
            <ScatterPlotWithRegressionLine data={visualizationData} />
          )}
        </div>
      </div>
    </BasePage>
  );
}

export default CorrelationAnalysisPage;
