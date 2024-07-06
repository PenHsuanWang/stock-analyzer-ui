import React, { useState, useEffect } from 'react';
import { getTrainerList, getTrainer } from '../../services/api';
import '../../styles/TrainerSelectorPanel.css';

const TrainerSelectorPanel = ({ onTrainerSelect }) => {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [trainerDetails, setTrainerDetails] = useState(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const trainerList = await getTrainerList();
        setTrainers(trainerList.trainers);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };

    fetchTrainers();
  }, []);

  const handleTrainerSelect = async (trainerId) => {
    setSelectedTrainer(trainerId);
    if (trainerId) {
      try {
        const trainer = await getTrainer(trainerId);
        setTrainerDetails(trainer);
        onTrainerSelect(trainerId);
      } catch (error) {
        console.error("Error fetching trainer details:", error);
      }
    } else {
      setTrainerDetails(null);
    }
  };

  return (
    <div className="trainer-selector-panel">
      <h3>Select Trainer</h3>
      <div className="trainer-selection">
        <select value={selectedTrainer} onChange={(e) => handleTrainerSelect(e.target.value)}>
          <option value="">Select Trainer</option>
          {trainers.map((trainer) => (
            <option key={trainer} value={trainer}>
              {trainer}
            </option>
          ))}
        </select>
      </div>
      {trainerDetails && (
        <div className="trainer-details">
          <h4>Trainer Details</h4>
          <p><strong>ID:</strong> {trainerDetails.trainer_id}</p>
          <p><strong>Type:</strong> {trainerDetails.trainer_type}</p>
          <p><strong>Loss Function:</strong> {trainerDetails.loss_function}</p>
          <p><strong>Optimizer:</strong> {trainerDetails.optimizer}</p>
          <p><strong>Learning Rate:</strong> {trainerDetails.learning_rate}</p>
          <p><strong>Device:</strong> {trainerDetails.device}</p>
        </div>
      )}
    </div>
  );
};

export default TrainerSelectorPanel;