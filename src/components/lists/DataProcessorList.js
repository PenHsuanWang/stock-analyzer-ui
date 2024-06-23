import React, { useState, useEffect } from 'react';
import { getDataProcessorList, getDataProcessor } from '../../services/api';
import '../../styles/ComponentList.css';

const DataProcessorList = ({ onSelect }) => {
  const [dataProcessors, setDataProcessors] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProcessor, setSelectedProcessor] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataProcessorList = await getDataProcessorList();
        setDataProcessors(dataProcessorList.data_processors);
      } catch (err) {
        setError(err.message || 'No response from the server. Please check your network connection.');
      }
    };

    fetchData();
  }, []);

  const handleSelect = async (processor) => {
    if (selectedProcessor === processor) {
      setSelectedProcessor(null);
      onSelect(null);
    } else {
      setSelectedProcessor(processor);
      try {
        const processorData = await getDataProcessor(processor);
        onSelect(processorData);
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
                type="radio"
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
