import React, { useState } from 'react';
import { runMLTraining } from '../../services/api';
import '../../styles/TrainingParameters.css';

const TrainingParameters = ({ onTrainingComplete }) => {
  const [epochs, setEpochs] = useState(20);
  const [status, setStatus] = useState(null);

  const handleTrain = async () => {
    try {
      const response = await runMLTraining({ epochs });
      setStatus(response.message);
      onTrainingComplete();
    } catch (error) {
      setStatus('Error starting training');
    }
  };

  return (
    <div className="training-parameters">
      <h3>Training Parameters</h3>
      <input
        type="number"
        value={epochs}
        onChange={(e) => setEpochs(parseInt(e.target.value))}
        placeholder="Enter number of epochs"
      />
      <button onClick={handleTrain}>Start Training</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default TrainingParameters;
