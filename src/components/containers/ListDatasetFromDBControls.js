import React, { useState, useEffect } from 'react';
import { getListDatasetFromDB } from '../../services/ListDatasetService';
import '../../styles/ListDatasetFromDBControls.css';

const ListDatasetFromDBControls = () => {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  useEffect(() => {
    // Fetch data inside useEffect
    const parseDataItem = (item) => {
      const parts = item.split(':');
      return {
        stock_id: parts[1],
        start_date: parts[2],
        end_date: parts[3]
      };
    };
    
    const fetchData = async () => {
      try {
        const fetchedData = await getListDatasetFromDB();
        if (Array.isArray(fetchedData)) {
          const parsedData = fetchedData.map(parseDataItem);
          setData(parsedData);
        } else {
          console.error("Received data is not an array:", fetchedData);
          setData([]);  // Set to an empty array as a fallback
        }       
      } catch (error) {
        console.error("Failed to fetch dataset:", error);
      }
    };    
    fetchData();
  }, []); // Empty dependency array means this effect will only run once, similar to componentDidMount

  const handleCheckboxChange = (index, isChecked) => {
    if (isChecked) {
      setSelectedData(prevSelected => [...prevSelected, data[index]]);
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
          {data.map((dataItem, index) => (
            <tr key={index}>
              <td>
                <input 
                  type="checkbox" 
                  onChange={e => handleCheckboxChange(index, e.target.checked)}
                />
              </td>
              <td>{dataItem.stock_id}</td>
              <td>{dataItem.start_date}</td>
              <td>{dataItem.end_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListDatasetFromDBControls;
