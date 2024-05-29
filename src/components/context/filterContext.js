// FiltersContext.js
import React, { createContext, useState, useContext } from 'react';

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
  const [filters, setFilters] = useState({});

  const updateFilters = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <FiltersContext.Provider value={{ filters, updateFilters, clearFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => {
  return useContext(FiltersContext);
};
