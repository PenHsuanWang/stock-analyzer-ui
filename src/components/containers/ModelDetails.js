import React from 'react';

const ModelDetails = ({ model }) => {
  if (!model) return null;

  const { name, version, details } = model;
  const { parameters, metrics, training_data_info, architecture } = details;

  return (
    <div>
      <h2>Model Details</h2>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Version:</strong> {version}</p>
      <h3>Parameters</h3>
      <ul>
        {parameters && Object.entries(parameters).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>
      <h3>Metrics</h3>
      <ul>
        {metrics && Object.entries(metrics).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>
      <h3>Training Data Info</h3>
      <p>{training_data_info}</p>
      <h3>Architecture</h3>
      <p>{architecture}</p>
    </div>
  );
};

export default ModelDetails;
