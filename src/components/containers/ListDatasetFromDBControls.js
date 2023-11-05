import React, { useState, useEffect } from 'react';
import { getListDatasetFromDB } from '../../services/api'; // 確認路徑是否正確
import '../../styles/ListDatasetFromDBControls.css';

const ListDatasetFromDBControls = ({ prefix }) => {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  useEffect(() => {
    // Fetch data inside useEffect
    const fetchData = async () => {
      try {
        // 使用 prop 中傳入的 prefix
        const response = await getListDatasetFromDB({ "prefix": prefix });
        const keysArray = response.keys;
        if (Array.isArray(keysArray)) {
          const parsedData = keysArray.map(parseDataKey).filter(item => item !== null);
          setData(parsedData);
        } else {
          console.error("Received data is not properly formatted:", keysArray);
          setData([]);
        }
      } catch (error) {
        console.error("Failed to fetch dataset:", error);
        setData([]);  // Set to an empty array on error
      }
    };    
    fetchData();
  }, [prefix]); // 添加 prefix 為 useEffect 的依賴

  const parseDataKey = (key) => {
    const parts = key.split(':');
    if(parts.length === 4) {
      return {
        stock_id: parts[1],
        start_date: parts[2],
        end_date: parts[3]
      };
    }
    return null;
  };

  const handleCheckboxChange = (index, isChecked) => {
    const selectedItem = data[index];
    if (isChecked) {
      setSelectedData(prevSelected => [...prevSelected, selectedItem]);
    } else {
      setSelectedData(prevSelected => prevSelected.filter(item => item !== selectedItem));
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
                  checked={selectedData.includes(dataItem)}
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
