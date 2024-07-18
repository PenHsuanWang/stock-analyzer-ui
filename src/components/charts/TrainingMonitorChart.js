// src/components/charts/TrainingMonitorChart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../../styles/TrainingMonitorChart.css';

const TrainingMonitorChart = ({ selectedTrainer }) => {
  const [lossData, setLossData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!selectedTrainer) return;

    setIsTraining(true);
    setErrorMessage(null);
    setLossData([]);

    const eventSource = new EventSource(`http://localhost:8000/ml_training_manager/trainers/${selectedTrainer.trainer_id}/progress`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message === 'Training finished') {
        setIsTraining(false);
        eventSource.close();
      } else {
        setLossData((prevData) => [
          ...prevData,
          { x: data.epoch, y: data.loss }
        ]);
        setLogs((prevLogs) => [
          ...prevLogs,
          `Epoch ${data.epoch}: Loss = ${data.loss}`
        ]);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      setErrorMessage('Error fetching training status.');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [selectedTrainer]);

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
