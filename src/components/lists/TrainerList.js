// src/components/lists/TrainerList.js
import React, { useState, useEffect } from 'react';
import { getTrainerList, deleteTrainer } from '../../services/api'; // Import deleteTrainer
import '../../styles/ComponentList.css';

const TrainerList = ({ onSelect, refreshList, onRefreshed }) => {
  const [trainers, setTrainers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const fetchData = async () => {
    try {
      const trainerList = await getTrainerList();
      setTrainers(trainerList.trainers);
      if (refreshList) {
        onRefreshed();
      }
    } catch (err) {
      setError(err.message || 'No response from the server. Please check your network connection.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshList]);

  const handleSelect = (trainer) => {
    if (selectedTrainer === trainer) {
      setSelectedTrainer(null);
      onSelect(null);
    } else {
      setSelectedTrainer(trainer);
      onSelect(trainer);
    }
  };

  const handleDelete = async (trainer) => {
    try {
      await deleteTrainer(trainer); // Call the API to delete the trainer
      fetchData(); // Refresh the list after deletion
    } catch (err) {
      setError(err.message || 'Failed to delete trainer.');
    }
  };

  return (
    <div className="component-list">
      <h4>Existing Trainers</h4>
      {error && <p className="error">{error}</p>}
      <ul className="no-bullets">
        {trainers.map((trainer) => (
          <li key={trainer} className="processor-item">
            <label>
              <input
                type="checkbox"
                name="trainer"
                checked={selectedTrainer === trainer}
                onChange={() => handleSelect(trainer)}
              />
              {trainer}
            </label>
            <button className="delete-button" onClick={() => handleDelete(trainer)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrainerList;
