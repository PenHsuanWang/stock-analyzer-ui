import React, { useState, useEffect } from 'react';
import { getListDatasetFromDB } from '../../services/api'; // 确认路径是否正确
import '../../styles/ListDatasetFromDBControls.css';

const ListDatasetFromDBControls = () => {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  useEffect(() => {
    // Fetch data inside useEffect
    const parseDataItem = (item) => {
      const parts = item.split(':');
      // Make sure to check if the data is valid
      if(parts.length >= 3) {
        return {
          stock_id: parts[0],
          start_date: parts[1],
          end_date: parts[2]
        };
      }
      return null;
    };

    const fetchData = async () => {
      try {
        const response = await getListDatasetFromDB({"prefix":"raw_stock_data"});
        const keysArray = response.keys;
        if (Array.isArray(keysArray)) {
          const parsedData = keysArray.map(key => {
            const parts = key.split(':');
            if(parts.length === 4) {
              return {
                stock_id: parts[1],
                start_date: parts[2],
                end_date: parts[3]
              };
            }
            return null;
          }).filter(item => item !== null);
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
  }, []);

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
