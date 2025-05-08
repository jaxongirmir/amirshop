import { createContext, useContext, useState, ReactNode } from "react";

interface FilterContextType {
  gender: string;
  setGender: (gender: string) => void;
  category: string;
  setCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [gender, setGender] = useState('all');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <FilterContext.Provider value={{
      gender,
      setGender,
      category,
      setCategory,
      sortBy,
      setSortBy,
      searchQuery,
      setSearchQuery,
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}
