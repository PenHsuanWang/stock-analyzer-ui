import React from 'react';

const ComparisonTable = ({ comparisonResult }) => {
  if (!comparisonResult) return null;

  const { parameters, metrics, training_data_info, architecture } = comparisonResult;

  return (
    <div>
      <h2>Comparison Result</h2>
      <table>
        <thead>
          <tr>
            <th>Aspect</th>
            <th>Model 1</th>
            <th>Model 2</th>
          </tr>
        </thead>
        <tbody>
          {parameters && Object.entries(parameters).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value.model1}</td>
              <td>{value.model2}</td>
            </tr>
          ))}
          {metrics && Object.entries(metrics).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value.model1}</td>
              <td>{value.model2}</td>
            </tr>
          ))}
          {training_data_info && Object.entries(training_data_info).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value.model1}</td>
              <td>{value.model2}</td>
            </tr>
          ))}
          {architecture && (
            <tr>
              <td>Architecture</td>
              <td>{architecture.model1}</td>
              <td>{architecture.model2}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
