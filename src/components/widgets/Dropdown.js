import React from 'react';

const Dropdown = ({ label, options, value, onChange }) => (
  <div className="dropdown">
    <label>
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  </div>
);

export default Dropdown;
