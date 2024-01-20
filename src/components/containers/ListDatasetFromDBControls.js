import React, { useState, useEffect, memo } from 'react';
import { getListDatasetFromDB } from '../../services/api';
import '../../styles/ListDatasetFromDBControls.css';

// Memoizing the component to prevent unnecessary re-renders
const ListDatasetFromDBControls = memo(({ prefix, refresh, setSelectedItems }) => {
  const [data, setData] = useState([]); // State for holding the list of datasets
  const [selectedData, setSelectedData] = useState([]); // State for holding selected datasets

  // Effect for fetching datasets based on the provided prefix
  useEffect(() => {
    console.log("ListDatasetFromDBControls useEffect", prefix);
    const fetchData = async () => {
      try {
        const response = await getListDatasetFromDB({ "prefix": prefix });
        if (Array.isArray(response.keys)) {
          const parsedData = response.keys.map(parseDataKey).filter(item => item !== null);
          setData(parsedData);
        } else {
          console.error("Received data is not properly formatted:", response.keys);
          setData([]);
        }
      } catch (error) {
        console.error("Failed to fetch dataset:", error);
        setData([]);
      }
    };
    fetchData();
  }, [prefix, refresh]); // Dependency array includes only prefix to avoid re-fetching on other state changes

  // Effect for passing selected datasets to the parent component
  useEffect(() => {
    setSelectedItems(selectedData);
  }, [selectedData, setSelectedItems]); // Dependency array ensures effect runs only when selectedData changes

  // Utility function for parsing dataset keys
  const parseDataKey = (key) => {
    const parts = key.split(':');
    if (parts.length === 4) {
      return {
        stock_id: parts[1],
        start_date: parts[2],
        end_date: parts[3]
      };
    }
    return null;
  };

  // Function to determine if an item is selected
  const isItemSelected = (item) => {
    return selectedData.some(selectedItem => 
      selectedItem.stock_id === item.stock_id &&
      selectedItem.start_date === item.start_date &&
      selectedItem.end_date === item.end_date
    );
  };

  // Handler for checkbox changes
  const handleCheckboxChange = (dataItem, isChecked) => {
    setSelectedData(prevSelected => 
      isChecked
        ? [...prevSelected, dataItem]
        : prevSelected.filter(item => 
            item.stock_id !== dataItem.stock_id ||
            item.start_date !== dataItem.start_date ||
            item.end_date !== dataItem.end_date
          )
    );
  };

  // Render the component UI
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
});

export default ListDatasetFromDBControls;
