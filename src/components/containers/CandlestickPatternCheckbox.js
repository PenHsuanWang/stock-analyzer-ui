import React from 'react';
import '../../styles/CandlestickPatternCheckbox.css';

const CandlestickPatternCheckbox = ({ patterns, selectedPatterns, setSelectedPatterns }) => {

  const nonNullPatterns = patterns.filter(pattern => pattern !== 'null');

  // Handle checkbox state change
  const handleCheckboxChange = (pattern, isChecked) => {
    setSelectedPatterns(prevSelected => {
      // Update the selected patterns based on the checkbox's checked state
      const updatedSelected = isChecked
        ? [...prevSelected, pattern]
        : prevSelected.filter(p => p !== pattern);

      // Update the parent component's state with the new selected patterns
      return updatedSelected;
    });
  };

  return (
    <div className="CandlestickPatternCheckbox">
      <div className="pattern-checkbox-list">
        {nonNullPatterns.map((pattern, index) => (
          <label key={index}>
            <input
              type="checkbox"
              value={pattern}
              checked={selectedPatterns.includes(pattern)}
              onChange={(e) => handleCheckboxChange(pattern, e.target.checked)}
            />
            {pattern}
          </label>
        ))}
      </div>
    </div>
  );
};

export default CandlestickPatternCheckbox;
