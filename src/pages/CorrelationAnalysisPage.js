import React, { useState } from 'react';
import BasePage from './BasePage';
import ListDatasetFromDBControls from '../components/containers/ListDatasetFromDBControls';
import ScatterAndHistogramChart from '../components/charts/ScatterAndHistogramChart';
import { fetchDataFromBackendDB } from '../services/api';
import '../styles/CorrelationAnalysisPage.css';

function CorrelationAnalysisPage() {
  const [baseDataset, setBaseDataset] = useState(null);
  const [compareDataset, setCompareDataset] = useState(null);
  const [visualizationData, setVisualizationData] = useState([]);

  const handleFetchData = async () => {
    if (baseDataset && compareDataset) {
      try {
        // 確認所選數據集包含必要的信息
        if (!baseDataset.stock_id || !compareDataset.stock_id) {
          console.error("Error: Selected datasets do not contain stock IDs.");
          return;
        }
        if (baseDataset.start_date !== compareDataset.start_date || baseDataset.end_date !== compareDataset.end_date) {
          console.error("Error: Selected datasets have mismatching date ranges.");
          return;
        }
  
        // 從後端服務請求基準數據集的數據
        const baseDataResponse = await fetchDataFromBackendDB({
          prefix: 'analyzed_stock_data',
          stock_id: baseDataset.stock_id,
          start_date: baseDataset.start_date,
          end_date: baseDataset.end_date
        });
  
        // 從後端服務請求比較數據集的數據
        const compareDataResponse = await fetchDataFromBackendDB({
          prefix: 'analyzed_stock_data',
          stock_id: compareDataset.stock_id,
          start_date: compareDataset.start_date,
          end_date: compareDataset.end_date
        });
  
        // 處理數據以創建散點圖數據結構
        // 此處僅示範，您可能需要根據實際數據結構調整映射邏輯
        const baseDataDailyReturns = baseDataResponse.data.map(item => item.Daily_Return);
        const compareDataDailyReturns = compareDataResponse.data.map(item => item.Daily_Return);
        const correlationData = baseDataDailyReturns.map((item, index) => ({
          x: item,
          y: compareDataDailyReturns[index]
        }));
  
        // 更新狀態以顯示圖表
        setVisualizationData(correlationData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setVisualizationData([]); // 確保清空之前的數據
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
            prefix="analyzed_stock_data"
            setSelectedItems={(items) => setBaseDataset(items[0])}
          />
          <ListDatasetFromDBControls
            prefix="analyzed_stock_data"
            setSelectedItems={(items) => setCompareDataset(items[0])}
          />
          <button onClick={handleFetchData}>Show Daily Return Scatter Correlation</button>
        </div>
        <div className="data-visualization-container">
          {visualizationData.length > 0 && (
            <ScatterAndHistogramChart data={visualizationData} />
          )}
        </div>
      </div>
    </BasePage>
  );
}

export default CorrelationAnalysisPage;
