import React from 'react';
import '../../styles/ModelDetails.css';

const ModelDetails = ({ model }) => {
  if (!model) return null;

  const { name, version, details } = model;
  const { parameters, metrics, training_data_info, architecture } = details;

  return (
    <div className="model-details">
      <h2>Model Details</h2>
      <table>
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
      <h3>Parameters</h3>
      <table>
        <tbody>
          {parameters && Object.entries(parameters).map(([key, value]) => (
            <tr key={key}>
              <th>{key}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Metrics</h3>
      <table>
        <tbody>
          {metrics && Object.entries(metrics).map(([key, value]) => (
            <tr key={key}>
              <th>{key}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Training Data Info</h3>
      <p>{training_data_info}</p>
      <h3>Architecture</h3>
      <p>{architecture}</p>
    </div>
  );
};

export default ModelDetails;
