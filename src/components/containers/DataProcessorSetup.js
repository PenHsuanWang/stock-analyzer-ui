import React, { useState, useEffect } from 'react';
import { initDataProcessor, fetchDataFromBackendDB } from '../../services/api';
import ListDatasetFromDBControls from './ListDatasetFromDBControls';
import '../../styles/DataProcessorSetup.css';

const DataProcessorSetup = ({ selectedDataProcessor, onSetupComplete, analyzedDataPrefix }) => {
  const [dataProcessorType, setDataProcessorType] = useState('time_series');
  const [dataProcessorName, setDataProcessorName] = useState('');
  const [extractColumn, setExtractColumn] = useState('');
  const [trainingDataRatio, setTrainingDataRatio] = useState(0.6);
  const [trainingWindowSize, setTrainingWindowSize] = useState(60);
  const [targetWindowSize, setTargetWindowSize] = useState(1);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedDataProcessor) {
      console.log('Selected Data Processor:', selectedDataProcessor);
      setDataProcessorType(selectedDataProcessor.data_processor_type || 'time_series');
      setDataProcessorName(selectedDataProcessor.id || '');
      setExtractColumn(selectedDataProcessor.extract_column ? selectedDataProcessor.extract_column.join(',') : '');
      setTrainingDataRatio(selectedDataProcessor.training_data_ratio || 0.6);
      setTrainingWindowSize(selectedDataProcessor.training_window_size || 60);
      setTargetWindowSize(selectedDataProcessor.target_window_size || 1);
    } else {
      setDataProcessorType('time_series');
      setDataProcessorName('');
      setExtractColumn('');
      setTrainingDataRatio(0.6);
      setTrainingWindowSize(60);
      setTargetWindowSize(1);
    }
  }, [selectedDataProcessor]);

  const handleSetup = async () => {
    if (!selectedDataset) {
      setStatus({ message: 'Please select a dataset', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      // Fetch data for the selected dataset
      const datasetResponse = await fetchDataFromBackendDB({
        prefix: analyzedDataPrefix,
        stock_id: selectedDataset.stock_id,
        start_date: selectedDataset.start_date,
        end_date: selectedDataset.end_date
      });

      if (!datasetResponse || !Array.isArray(datasetResponse.data)) {
        throw new Error('Failed to fetch the dataset');
      }

      const dataframePayload = {
        data: datasetResponse.data,
        columns: Object.keys(datasetResponse.data[0])
      };

      const payload = {
        data_processor_id: dataProcessorName || 'null_data_processor_id',
        data_processor_type: dataProcessorType,
        dataframe: dataframePayload,
        kwargs: {
          extract_column: extractColumn.split(','),
          training_data_ratio: trainingDataRatio,
          training_window_size: trainingWindowSize,
          target_window_size: targetWindowSize
        }
      };

      console.log("Payload sent to initDataProcessor:", JSON.stringify(payload, null, 2));

      const response = await initDataProcessor(payload);

      setStatus({ message: response.message, type: 'success' });
      onSetupComplete();
    } catch (error) {
      setStatus({ message: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="data-processor-setup">
      <h3>Setup Data Processor</h3>
      <div className="data-list-container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
        <ListDatasetFromDBControls
          prefix={analyzedDataPrefix}
          setSelectedItems={(items) => setSelectedDataset(items[0])}
        />
      </div>
      <input
        type="text"
        value={dataProcessorName}
        onChange={(e) => setDataProcessorName(e.target.value)}
        placeholder="Enter data processor name"
      />
      <input
        type="text"
        value={dataProcessorType}
        onChange={(e) => setDataProcessorType(e.target.value)}
        placeholder="Enter data processor type"
      />
      <input
        type="text"
        value={extractColumn}
        onChange={(e) => setExtractColumn(e.target.value)}
        placeholder="Enter columns to extract (comma separated)"
      />
      <input
        type="number"
        value={trainingDataRatio}
        onChange={(e) => setTrainingDataRatio(parseFloat(e.target.value))}
        placeholder="Enter training data ratio"
      />
      <input
        type="number"
        value={trainingWindowSize}
        onChange={(e) => setTrainingWindowSize(parseInt(e.target.value))}
        placeholder="Enter training window size"
      />
      <input
        type="number"
        value={targetWindowSize}
        onChange={(e) => setTargetWindowSize(parseInt(e.target.value))}
        placeholder="Enter target window size"
      />
      <button onClick={handleSetup} disabled={isLoading}>
        {isLoading ? 'Setting up...' : 'Set Data Processor'}
      </button>
      {status && <p className={`status ${status.type}`}>{status.message}</p>}
    </div>
  );
};

export default DataProcessorSetup;
