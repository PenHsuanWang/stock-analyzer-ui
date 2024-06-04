import React from 'react';

const ModelListTable = ({ models, onSelectModel }) => (
  <div className="model-table">
    <table>
      <thead>
        <tr>
          <th>Model Name</th>
          <th>Version</th>
          <th>Stage</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {models.map(model => (
          model.latest_versions.map(version => (
            <tr key={`${model.name}-${version.version}`} onClick={() => onSelectModel(model.name, version.version)}>
              <td>{model.name}</td>
              <td>{version.version}</td>
              <td>{version.stage}</td>
              <td>{version.description}</td>
            </tr>
          ))
        ))}
      </tbody>
    </table>
  </div>
);

export default ModelListTable;
