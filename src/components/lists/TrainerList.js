import React, { useState, useEffect } from 'react';
import { getTrainerList } from '../../services/api';
import '../../styles/ComponentList.css';

const TrainerList = ({ onSelect }) => {
  const [trainers, setTrainers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trainerList = await getTrainerList();
        setTrainers(trainerList.trainers);
      } catch (err) {
        setError(err.message || 'No response from the server. Please check your network connection.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="component-list">
      <h4>Existing Trainers</h4>
      {error && <p className="error">{error}</p>}
      <ul>
        {trainers.map((trainer) => (
          <li key={trainer}>
            <label>
              <input
                type="radio"
                name="trainer"
                onChange={() => onSelect(trainer)}
              />
              {trainer}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrainerList;
