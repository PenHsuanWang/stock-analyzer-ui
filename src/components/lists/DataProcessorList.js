// src/components/lists/DataProcessorList.js
import React, { useState, useEffect } from 'react';
import { getDataProcessorList, getDataProcessor, deleteDataProcessor } from '../../services/api';
import '../../styles/ComponentList.css';

const DataProcessorList = ({ onSelect, refreshList, onRefreshed }) => {
  const [dataProcessors, setDataProcessors] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProcessor, setSelectedProcessor] = useState(null);

  const fetchData = async () => {
    try {
      const dataProcessorList = await getDataProcessorList();
      console.log("Fetched Data Processor List:", dataProcessorList); // Debugging log
      setDataProcessors(dataProcessorList.data_processors);
      if (refreshList) {
        onRefreshed();  // Notify parent that refresh has been handled
      }
    } catch (err) {
      setError(err.message || 'No response from the server. Please check your network connection.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshList]);  // Fetch on mount and when refreshList changes

  const handleSelect = async (processor) => {
    if (selectedProcessor === processor) {
      setSelectedProcessor(null);
      onSelect(null);
    } else {
      setSelectedProcessor(processor);
      try {
        const processorData = await getDataProcessor(processor);
        if (processorData.data_processor) {
          console.log("Fetched Data Processor:", processorData.data_processor); // Debugging log
          // Adjust data_processor_type back to 'time_series' if needed
          const adjustedProcessorData = {
            ...processorData.data_processor,
            data_processor_type: processorData.data_processor.data_processor_type === 'TimeSeriesDataProcessor' ? 'time_series' : processorData.data_processor.data_processor_type,
          };
          onSelect(adjustedProcessorData);
        } else {
          setError('Failed to fetch processor data.');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch processor data.');
      }
    }
  };

  const handleDelete = async (processor) => {
    try {
      await deleteDataProcessor(processor);
      fetchData(); // Refresh the list after deletion
    } catch (err) {
      setError(err.message || 'Failed to delete processor.');
    }
  };

  return (
    <div className="component-list">
      <h4>Existing Data Processors</h4>
      {error && <p className="error">{error}</p>}
      <ul className="no-bullets">
        {dataProcessors.map((processor) => (
          <li key={processor} className="processor-item">
            <label>
              <input
                type="checkbox"
                name="dataProcessor"
                checked={selectedProcessor === processor}
                onChange={() => handleSelect(processor)}
              />
              {processor}
            </label>
            <button className="delete-button" onClick={() => handleDelete(processor)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataProcessorList;
