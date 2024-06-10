import React, { useRef, useEffect } from 'react';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register required elements with Chart.js
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MetricsComparison = ({ metrics }) => {
    const chartRef = useRef(null);

    const data = {
        labels: ['F1 Score', 'Precision', 'Recall', 'Avg Loss'],
        datasets: [
            {
                label: 'Model 1',
                data: metrics.model1 || [],
                backgroundColor: 'rgba(75,192,192,0.6)',
            },
            {
                label: 'Model 2',
                data: metrics.model2 || [],
                backgroundColor: 'rgba(153,102,255,0.6)',
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
        <div className="metrics-comparison">
            <h2>Metrics Comparison</h2>
            <Bar ref={chartRef} data={data} />
        </div>
    );
};

export default MetricsComparison;
