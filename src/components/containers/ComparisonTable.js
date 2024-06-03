import React from 'react';

const ComparisonTable = ({ comparisonResult, modelType1, modelType2 }) => {
  if (!comparisonResult) return null;

  const { parameters, metrics, training_data_info, architecture } = comparisonResult;

  const getRelevantMetrics = (metrics, modelType) => {
    const metricNames = Object.keys(metrics);
    const relevantMetrics = {};

    if (modelType === 'lstm') {
      metricNames.forEach(metric => {
        if (metric.includes('loss') || metric.includes('mse')) {
          relevantMetrics[metric] = metrics[metric];
        }
      });
    } else if (modelType === 'random_forest') {
      metricNames.forEach(metric => {
        if (metric.includes('accuracy') || metric.includes('precision') || metric.includes('recall')) {
          relevantMetrics[metric] = metrics[metric];
        }
      });
    }
    // Add more conditions for other model types if needed

    return relevantMetrics;
  };

  const filteredMetrics1 = getRelevantMetrics(metrics, modelType1);
  const filteredMetrics2 = getRelevantMetrics(metrics, modelType2);

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
          {Object.entries(filteredMetrics1).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value.model1}</td>
              <td>{filteredMetrics2[key]?.model2 || ''}</td>
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
