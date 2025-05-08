import { useState, useRef, useEffect } from "react";
import { useFilter } from "../contexts/FilterContext";

export default function CategoryFilter() {
  const { 
    gender, setGender,
    category, setCategory,
    sortBy, setSortBy 
  } = useFilter();
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Filter categories based on selected gender
  const getCategoriesForGender = () => {
    if (gender === 'men') {
      return [
        { id: 'men-tshirts', label: 'T-Shirts', value: 'tshirts' },
        { id: 'men-shirts', label: 'Shirts', value: 'shirts' },
        { id: 'men-pants', label: 'Pants', value: 'pants' },
        { id: 'men-shoes', label: 'Shoes', value: 'shoes' },
        { id: 'men-accessories', label: 'Accessories', value: 'accessories' },
      ];
    } else if (gender === 'women') {
      return [
        { id: 'women-dresses', label: 'Dresses', value: 'dresses' },
        { id: 'women-tops', label: 'Tops', value: 'tops' },
        { id: 'women-skirts', label: 'Skirts', value: 'skirts' },
        { id: 'women-pants', label: 'Pants', value: 'pants' },
        { id: 'women-shoes', label: 'Shoes', value: 'shoes' },
        { id: 'women-accessories', label: 'Accessories', value: 'accessories' },
      ];
    }
    return [];
  };
  
  const handleApplyFilters = () => {
    setIsFilterOpen(false);
  };
  
  return (
    <section className="mb-12">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Featured Products</h2>
        
        <div className="flex space-x-4">
          <div className="relative" ref={filterRef}>
            <button 
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-300 hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <span>Categories</span>
              <i className={`fas fa-chevron-${isFilterOpen ? 'up' : 'down'} text-xs`}></i>
            </button>
            
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-10">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-accent focus:ring-accent" 
                      checked={gender === 'all'}
                      onChange={() => setGender('all')}
                    />
                    <span>All Items</span>
                  </label>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <p className="font-semibold text-sm text-gray-500 mb-2">Men</p>
                    <div className="space-y-2 pl-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="gender" 
                          className="rounded-full border-gray-300 text-accent focus:ring-accent"
                          checked={gender === 'men' && !category}
                          onChange={() => {
                            setGender('men');
                            setCategory('');
                          }}
                        />
                        <span>All Men's</span>
                      </label>
                      {gender === 'men' || gender === 'all' ? (
                        getCategoriesForGender().map(cat => (
                          <label key={cat.id} className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300 text-accent focus:ring-accent"
                              checked={gender === 'men' && category === cat.value}
                              onChange={() => {
                                setGender('men');
                                setCategory(category === cat.value ? '' : cat.value);
                              }}
                            />
                            <span>{cat.label}</span>
                          </label>
                        ))
                      ) : null}
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <p className="font-semibold text-sm text-gray-500 mb-2">Women</p>
                    <div className="space-y-2 pl-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="gender" 
                          className="rounded-full border-gray-300 text-accent focus:ring-accent"
                          checked={gender === 'women' && !category}
                          onChange={() => {
                            setGender('women');
                            setCategory('');
                          }}
                        />
                        <span>All Women's</span>
                      </label>
                      {gender === 'women' || gender === 'all' ? (
                        getCategoriesForGender().map(cat => (
                          <label key={cat.id} className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300 text-accent focus:ring-accent"
                              checked={gender === 'women' && category === cat.value}
                              onChange={() => {
                                setGender('women');
                                setCategory(category === cat.value ? '' : cat.value);
                              }}
                            />
                            <span>{cat.label}</span>
                          </label>
                        ))
                      ) : null}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-2 border-t border-gray-100 flex justify-end">
                  <button 
                    className="bg-accent text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors duration-200"
                    onClick={handleApplyFilters}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative" ref={sortRef}>
            <button 
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-300 hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
              onClick={() => setIsSortOpen(!isSortOpen)}
            >
              <span>Sort By</span>
              <i className={`fas fa-chevron-${isSortOpen ? 'up' : 'down'} text-xs`}></i>
            </button>
            
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-10">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      className="rounded-full border-gray-300 text-accent focus:ring-accent" 
                      name="sort" 
                      value="popular"
                      checked={sortBy === 'popular'}
                      onChange={() => setSortBy('popular')}
                    />
                    <span>Popular</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      className="rounded-full border-gray-300 text-accent focus:ring-accent" 
                      name="sort" 
                      value="newest"
                      checked={sortBy === 'newest'}
                      onChange={() => setSortBy('newest')}
                    />
                    <span>Newest</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      className="rounded-full border-gray-300 text-accent focus:ring-accent" 
                      name="sort" 
                      value="price-low"
                      checked={sortBy === 'price-low'}
                      onChange={() => setSortBy('price-low')}
                    />
                    <span>Price: Low to High</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      className="rounded-full border-gray-300 text-accent focus:ring-accent" 
                      name="sort" 
                      value="price-high"
                      checked={sortBy === 'price-high'}
                      onChange={() => setSortBy('price-high')}
                    />
                    <span>Price: High to Low</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
