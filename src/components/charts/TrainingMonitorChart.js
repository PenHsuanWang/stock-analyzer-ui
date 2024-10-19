// src/components/charts/TrainingMonitorChart.js

import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../../styles/TrainingMonitorChart.css';

const TrainingMonitorChart = ({ selectedTrainer, onTrainingStatusChange, trainingSessionId }) => {
  const [lossData, setLossData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (!selectedTrainer) return;

    // Reset chart data when a new training session starts
    setLossData([]);
    setLogs([]);
    setErrorMessage(null);

    // Close any existing EventSource
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // Open a new EventSource for the current training session
    const eventSource = new EventSource(
      `http://localhost:8000/ml_training_manager/trainers/${selectedTrainer.trainer_id || selectedTrainer}/progress`
    );
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.message === 'Training finished') {
        eventSource.close();
        eventSourceRef.current = null;

        setLogs((prevLogs) => [
          ...prevLogs,
          `Training finished. Final Loss: ${data.final_loss}`,
        ]);

        if (onTrainingStatusChange) {
          onTrainingStatusChange('finished');
        }
      } else if (data.message === 'Training error') {
        setErrorMessage('An error occurred during training.');
        eventSource.close();
        eventSourceRef.current = null;

        if (onTrainingStatusChange) {
          onTrainingStatusChange('error');
        }
      } else {
        // Append new loss data
        setLossData((prevData) => [
          ...prevData,
          { x: data.epoch, y: data.loss },
        ]);

        // Log the current epoch and loss
        setLogs((prevLogs) => [
          ...prevLogs,
          `Epoch ${data.epoch}: Loss = ${data.loss}`,
        ]);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      setErrorMessage('Error fetching training status.');
      eventSource.close();
      eventSourceRef.current = null;

      if (onTrainingStatusChange) {
        onTrainingStatusChange('error');
      }
    };

    // Cleanup EventSource on component unmount or trainingSessionId change
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [selectedTrainer, trainingSessionId]); // Dependency array includes trainingSessionId to reinitialize on session start

  const data = {
    labels: lossData.map((point) => point.x),
    datasets: [
      {
        label: 'Loss',
        data: lossData.map((point) => point.y),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Epoch',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Loss',
        },
      },
    },
  };

  return (
    <div className="training-monitor-chart">
      <h3>Training Monitor</h3>
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
