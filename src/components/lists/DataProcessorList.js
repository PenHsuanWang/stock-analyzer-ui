import React, { useState, useEffect } from 'react';
import { getDataProcessorList } from '../../services/api';
import '../../styles/ComponentList.css';

const DataProcessorList = ({ onSelect }) => {
  const [dataProcessors, setDataProcessors] = useState([]);
  const [error, setError] = useState(null);

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
                onChange={() => onSelect(processor)}
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
