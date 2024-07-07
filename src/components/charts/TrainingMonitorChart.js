import React, { useEffect, useState } from 'react';
import { runMLTraining, getTrainingStatus } from '../../services/api';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../../styles/TrainingMonitorChart.css';

const TrainingMonitorChart = ({ selectedTrainer }) => {
  const [trainingStatus, setTrainingStatus] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [lossData, setLossData] = useState([]);
  const maxRetries = 3;

  useEffect(() => {
    let interval;
    if (isTraining) {
      interval = setInterval(async () => {
        try {
          const status = await getTrainingStatus();
          setTrainingStatus(status);
          setLogs((prevLogs) => [...prevLogs, ...status.logs]);
          setLossData((prevLossData) => [...prevLossData, { x: status.epoch, y: status.loss }]);
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
    const backendMessage = error.response?.data?.message;
    const defaultMessage = `Error: ${error.response?.statusText || 'Unknown error'}`;
    const message = backendMessage || defaultMessage;

    if ([422, 404].includes(errorCode)) {
      // Stop retries for these error codes
      setIsTraining(false);
      setRetryCount(0);
      setErrorMessage(message);
    } else if (retryCount < maxRetries) {
      // Retry for other error codes
      setRetryCount(retryCount + 1);
    } else {
      // Stop after max retries
      setIsTraining(false);
      setRetryCount(0);
      setErrorMessage(message);
    }
  };

  const handleStartTraining = async () => {
    if (!selectedTrainer) return;
    setIsTraining(true);
    setRetryCount(0);
    setErrorMessage(null); // Clear previous error message
    setLossData([]); // Clear previous loss data
    try {
      await runMLTraining({ trainer_id: selectedTrainer });
    } catch (error) {
      console.error("Error starting training:", error);
      handleRetry(error);
    }
  };

  const data = {
    datasets: [
      {
        label: 'Loss',
        data: lossData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Epoch'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Loss'
        }
      }
    }
  };

  return (
    <div className="training-monitor-chart">
      <h3>Training Monitor</h3>
      <button onClick={handleStartTraining} disabled={isTraining || !selectedTrainer}>
        {isTraining ? 'Training...' : 'Start Training'}
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <Line data={data} options={options} />
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
