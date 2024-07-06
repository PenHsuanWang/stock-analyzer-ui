import React, { useEffect, useState } from 'react';
import { runMLTraining, getTrainingStatus } from '../../services/api';
import '../../styles/TrainingMonitorChart.css';

const TrainingMonitorChart = ({ selectedTrainer }) => {
  const [trainingStatus, setTrainingStatus] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const maxRetries = 3;

  useEffect(() => {
    let interval;
    if (isTraining) {
      interval = setInterval(async () => {
        try {
          const status = await getTrainingStatus();
          setTrainingStatus(status);
          setLogs((prevLogs) => [...prevLogs, ...status.logs]);
        } catch (error) {
          console.error("Error fetching training status:", error);
          handleRetry(error);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTraining, retryCount]);

  const handleRetry = (error) => {
    const errorCode = error.response?.status;
    if ([422, 404].includes(errorCode)) {
      // Stop retries for these error codes
      setIsTraining(false);
      setRetryCount(0);
      setErrorMessage(`Error: ${error.response?.statusText || 'Unknown error'}`);
    } else if (retryCount < maxRetries) {
      // Retry for other error codes
      setRetryCount(retryCount + 1);
    } else {
      // Stop after max retries
      setIsTraining(false);
      setRetryCount(0);
      setErrorMessage(`Error: ${error.response?.statusText || 'Unknown error'}`);
    }
  };

  const handleStartTraining = async () => {
    if (!selectedTrainer) return;
    setIsTraining(true);
    setRetryCount(0);
    setErrorMessage(null); // Clear previous error message
    try {
      await runMLTraining({ trainer_id: selectedTrainer });
    } catch (error) {
      console.error("Error starting training:", error);
      handleRetry(error);
    }
  };

  return (
    <div className="training-monitor-chart">
      <h3>Training Monitor</h3>
      <button onClick={handleStartTraining} disabled={isTraining || !selectedTrainer}>
        {isTraining ? 'Training...' : 'Start Training'}
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {trainingStatus && (
        <div className="training-status">
          <p><strong>Epoch:</strong> {trainingStatus.epoch}</p>
          <p><strong>Loss:</strong> {trainingStatus.loss}</p>
          <p><strong>Time Remaining:</strong> {trainingStatus.time_remaining}</p>
        </div>
      )}
      <div className="logs">
        <h4>Logs</h4>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrainingMonitorChart;