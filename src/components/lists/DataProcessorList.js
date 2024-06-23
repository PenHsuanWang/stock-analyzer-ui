import React, { useState, useEffect } from 'react';
import { getDataProcessorList, getDataProcessor } from '../../services/api';
import '../../styles/ComponentList.css';

const DataProcessorList = ({ onSelect, refreshList, onRefreshed }) => {
  const [dataProcessors, setDataProcessors] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProcessor, setSelectedProcessor] = useState(null);

  const fetchData = async () => {
    try {
      const dataProcessorList = await getDataProcessorList();
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
        console.log("Fetched Data Processor:", processorData.data_processor); // Debugging log
        onSelect(processorData.data_processor);
      } catch (err) {
        setError(err.message || 'Failed to fetch processor data.');
      }
    }
  };

  return (
    <div className="component-list">
      <h4>Existing Data Processors</h4>
      {error && <p className="error">{error}</p>}
      <ul className="no-bullets">
        {dataProcessors.map((processor) => (
          <li key={processor}>
            <label>
              <input
                type="checkbox"
                name="dataProcessor"
                checked={selectedProcessor === processor}
                onChange={() => handleSelect(processor)}
              />
              {processor}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataProcessorList;
