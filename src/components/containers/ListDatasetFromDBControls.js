// components/containers/ListDatasetFromDBControls.js
import React, { useState } from 'react';
import '../../styles/ListDatasetFromDBControls.css';

const mockData = [
  { stock_id: "AAPL", start_date: "2022-01-01", end_date: "2022-01-31" },
  { stock_id: "MSFT", start_date: "2022-02-01", end_date: "2022-02-28" },
  { stock_id: "GOOGL", start_date: "2022-03-01", end_date: "2022-03-31" },
  // ... (more mock data)
];

const ListDatasetFromDBControls = () => {
  const [selectedData, setSelectedData] = useState([]);

  const handleCheckboxChange = (index, isChecked) => {
    if (isChecked) {
      setSelectedData(prevSelected => [...prevSelected, mockData[index]]);
    } else {
      setSelectedData(prevSelected => prevSelected.filter((_, idx) => idx !== index));
    }
  };

  return (
    <div className="ListDatasetFromDBControls">
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Stock ID</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((data, index) => (
            <tr key={index}>
              <td>
                <input 
                  type="checkbox" 
                  onChange={e => handleCheckboxChange(index, e.target.checked)}
                />
              </td>
              <td>{data.stock_id}</td>
              <td>{data.start_date}</td>
              <td>{data.end_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListDatasetFromDBControls;
