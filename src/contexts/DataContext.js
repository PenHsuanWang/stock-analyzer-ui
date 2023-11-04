// src/contexts/DataContext.js
import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [prefix, setPrefix] = useState('');

  const updatePrefix = newPrefix => {
    setPrefix(newPrefix);
  };

  return (
    <DataContext.Provider value={{ prefix, updatePrefix }}>
      {children}
    </DataContext.Provider>
  );
};
