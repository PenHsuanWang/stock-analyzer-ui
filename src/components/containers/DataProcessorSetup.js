import React, { useState, useEffect } from 'react';
import { initDataProcessor } from '../../services/api';
import '../../styles/DataProcessorSetup.css';

const DataProcessorSetup = ({ selectedDataProcessor, onSetupComplete }) => {
  const [dataProcessorType, setDataProcessorType] = useState('');
  const [extractColumn, setExtractColumn] = useState('');
  const [trainingDataRatio, setTrainingDataRatio] = useState(0.6);
  const [trainingWindowSize, setTrainingWindowSize] = useState(60);
  const [targetWindowSize, setTargetWindowSize] = useState(1);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedDataProcessor) {
      // Assuming `selectedDataProcessor` is the complete processor object or sufficient data to fill the form
      setDataProcessorType(selectedDataProcessor.data_processor_type || '');
      setExtractColumn(selectedDataProcessor.extract_column ? selectedDataProcessor.extract_column.join(',') : '');
      setTrainingDataRatio(selectedDataProcessor.training_data_ratio || 0.6);
      setTrainingWindowSize(selectedDataProcessor.training_window_size || 60);
      setTargetWindowSize(selectedDataProcessor.target_window_size || 1);
    } else {
      // Clear the form when there is no processor selected
      setDataProcessorType('');
      setExtractColumn('');
      setTrainingDataRatio(0.6);
      setTrainingWindowSize(60);
      setTargetWindowSize(1);
    }
  }, [selectedDataProcessor]);

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const response = await initDataProcessor({
        data_processor_id: selectedDataProcessor ? selectedDataProcessor.id : 'example_data_processor_id',
        data_processor_type: dataProcessorType,
        dataframe: { data: [], columns: [] }, // Include your DataFrame payload here
        kwargs: {
          extract_column: extractColumn.split(','),
          training_data_ratio: trainingDataRatio,
          training_window_size: trainingWindowSize,
          target_window_size: targetWindowSize
        }
      });
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
