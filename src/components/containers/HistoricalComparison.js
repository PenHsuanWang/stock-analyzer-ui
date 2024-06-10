import React, { useRef, useEffect } from 'react';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register required elements with Chart.js
Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const HistoricalComparison = ({ history }) => {
    const chartRef = useRef(null);

    const data = {
        labels: history.map(entry => entry.version),
        datasets: [
            {
                label: 'F1 Score',
                data: history.map(entry => entry.f1Score),
                borderColor: 'rgba(75,192,192,1)',
                fill: false,
            },
            {
                label: 'Precision',
                data: history.map(entry => entry.precision),
                borderColor: 'rgba(153,102,255,1)',
                fill: false,
            },
        ],
    };

    useEffect(() => {
        return () => {
            // Cleanup chart instance to avoid canvas reuse error
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className="historical-comparison">
            <h2>Historical Comparison</h2>
            <Line ref={chartRef} data={data} />
            <div className="change-logs">
                <h3>Change Logs</h3>
                <ul>
                    {history.map(entry => (
                        <li key={entry.version}>{entry.version} - {entry.notes}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default HistoricalComparison;
