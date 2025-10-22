import React from 'react';
import '../../styles/CandlestickPatternCheckbox.css';

const CandlestickPatternCheckbox = ({ patterns, selectedPatterns, setSelectedPatterns }) => {

  const nonNullPatterns = patterns.filter(pattern => pattern !== 'null');

  // Handle checkbox state change
  const handleCheckboxChange = (pattern, isChecked) => {
    setSelectedPatterns(prevSelected => {
      const updatedSelected = isChecked
        ? [...prevSelected, pattern]
        : prevSelected.filter(p => p !== pattern);
      return updatedSelected;
    });
  };

  // Handle Select All
  const handleSelectAll = () => {
    setSelectedPatterns([...nonNullPatterns]);
  };

  // Handle Clear All
  const handleClearAll = () => {
    setSelectedPatterns([]);
  };

  return (
    <div className="CandlestickPatternCheckbox">
      <div className="pattern-header">
        <h3 className="pattern-title">
          Available Patterns 
          <span className="pattern-count">({nonNullPatterns.length})</span>
        </h3>
        <div className="pattern-actions">
          <button 
            className="pattern-action-btn select-all"
            onClick={handleSelectAll}
            disabled={selectedPatterns.length === nonNullPatterns.length}
            aria-label="Select all patterns"
          >
            Select All
          </button>
          <button 
            className="pattern-action-btn clear-all"
            onClick={handleClearAll}
            disabled={selectedPatterns.length === 0}
            aria-label="Clear all patterns"
          >
            Clear
          </button>
        </div>
      </div>

      {nonNullPatterns.length > 0 ? (
        <div className="pattern-checkbox-list">
          {nonNullPatterns.map((pattern, index) => (
            <label key={index} className="pattern-checkbox-item">
              <input
                type="checkbox"
                value={pattern}
                checked={selectedPatterns.includes(pattern)}
                onChange={(e) => handleCheckboxChange(pattern, e.target.checked)}
                aria-label={`Pattern: ${pattern}`}
              />
              <span className="pattern-name">{pattern}</span>
              {selectedPatterns.includes(pattern) && (
                <span className="pattern-indicator">✓</span>
              )}
            </label>
          ))}
        </div>
      ) : (
        <div className="pattern-empty-state">
          <p>No patterns detected in the selected data</p>
        </div>
      )}

      {selectedPatterns.length > 0 && (
        <div className="pattern-summary">
          <span className="summary-text">
            {selectedPatterns.length} pattern{selectedPatterns.length > 1 ? 's' : ''} selected
          </span>
        </div>
      )}
    </div>
  );
};

export default CandlestickPatternCheckbox;
