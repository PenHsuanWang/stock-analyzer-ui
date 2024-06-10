import React from 'react';
import '../../styles/ModelDetails.css';

const ModelDetails = ({ model }) => {
  if (!model) return null;

  const { name, version, details } = model;
  const { parameters, metrics, training_data_info, architecture } = details;

  return (
    <div className="model-details">
      <div className="section">
        <h2>Model Details</h2>
        <table className="details-table">
          <tbody>
            <tr>
              <th>Name:</th>
              <td>{name}</td>
            </tr>
            <tr>
              <th>Version:</th>
              <td>{version}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="section">
        <h3>Parameters</h3>
        <table className="details-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {parameters && Object.entries(parameters).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h3>Metrics</h3>
        <table className="details-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {metrics && Object.entries(metrics).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h3>Training Data Info</h3>
        <p>{training_data_info}</p>
      </div>

      <div className="section">
        <h3>Architecture</h3>
        <p>{architecture}</p>
      </div>
    </div>
  );
};

export default ModelDetails;
