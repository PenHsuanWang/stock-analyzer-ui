import React, { useState, useEffect } from 'react';
import { getListDatasetFromDB } from '../../services/api'; // 確認路徑是否正確
import '../../styles/ListDatasetFromDBControls.css';

const ListDatasetFromDBControls = ({ prefix, refresh = false, setSelectedItems }) => {
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
  }, [prefix, refresh]); // 'prefix' and 'refresh' are dependencies of this effect

  // This effect is used to communicate the selected datasets back to the parent component
  // Whenever 'selectedData' changes, we call 'setSelectedDatasets' to update the parent's state
  useEffect(() => {
    setSelectedItems(selectedData);
  }, [selectedData, setSelectedItems]); // 'selectedData' and 'setSelectedDatasets' are dependencies of this effect

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

  const isItemSelected = (item) => {
    return selectedData.some(selectedItem => 
      selectedItem.stock_id === item.stock_id &&
      selectedItem.start_date === item.start_date &&
      selectedItem.end_date === item.end_date
    );
  };
  

  const handleCheckboxChange = (dataItem, isChecked) => {
    if (isChecked) {
      setSelectedData(prevSelected => [...prevSelected, dataItem]);
    } else {
      setSelectedData(prevSelected => prevSelected.filter(item => 
        item.stock_id !== dataItem.stock_id ||
        item.start_date !== dataItem.start_date ||
        item.end_date !== dataItem.end_date
      ));
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
          {data.map((dataItem) => (
            <tr key={`${dataItem.stock_id}-${dataItem.start_date}-${dataItem.end_date}`}>
              <td>
                <input 
                  type="checkbox" 
                  checked={isItemSelected(dataItem)}
                  onChange={e => handleCheckboxChange(dataItem, e.target.checked)}
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
