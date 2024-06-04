import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../../styles/ModelListTable.css';

const ModelListTable = ({ models, onSelectModel }) => {
    const [expandedModels, setExpandedModels] = useState({});
  
    const handleToggle = (modelName) => {
      setExpandedModels(prevState => ({
        ...prevState,
        [modelName]: !prevState[modelName],
      }));
    };
  
    return (
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
              <React.Fragment key={model.name}>
                <tr className="model-row" onClick={() => handleToggle(model.name)}>
                  <td>
                    <FontAwesomeIcon icon={expandedModels[model.name] ? faChevronDown : faChevronRight} /> {model.name}
                  </td>
                  <td colSpan="3"></td>
                </tr>
                {expandedModels[model.name] && model.latest_versions.map(version => (
                  <tr key={`${model.name}-${version.version}`} className="version-row" onClick={() => onSelectModel(model.name, version.version)}>
                    <td className="child-row">{model.name}</td>
                    <td>{version.version}</td>
                    <td>{version.stage}</td>
                    <td>{version.description}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default ModelListTable;
