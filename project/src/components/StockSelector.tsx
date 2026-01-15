import React, { useContext, useState, useEffect, useRef } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { StockDataContext } from '../context/StockDataContext';
import { stockList, sectors, industries } from '../data/stockList';

const StockSelector: React.FC = () => {
  const { selectedStock, setSelectedStock, fetchStockData } = useContext(StockDataContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [filteredStocks, setFilteredStocks] = useState(stockList);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter stocks based on search term and filters
    const filtered = stockList.filter(stock => {
      const matchesSearch = 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSector = !selectedSector || stock.sector === selectedSector;
      const matchesIndustry = !selectedIndustry || stock.industry === selectedIndustry;
      
      return matchesSearch && matchesSector && matchesIndustry;
    });
    
    setFilteredStocks(filtered);
  }, [searchTerm, selectedSector, selectedIndustry]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setFilterDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectStock = (symbol: string) => {
    setSelectedStock(symbol);
    setSearchTerm('');
    setDropdownOpen(false);
    fetchStockData();
  };

  const clearFilters = () => {
    setSelectedSector('');
    setSelectedIndustry('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setDropdownOpen(true);
            }}
            onFocus={() => setDropdownOpen(true)}
            placeholder={selectedStock || "Search stocks..."}
            className="w-full pl-10 pr-10 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          {(selectedStock || searchTerm) && (
            <button
              onClick={() => {
                setSelectedStock('');
                setSearchTerm('');
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="relative" ref={filterDropdownRef}>
          <button
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            className={`p-2 rounded-lg border ${
              selectedSector || selectedIndustry
                ? 'border-sky-500 text-sky-500'
                : 'border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
          >
            <Filter size={20} />
          </button>
          
          {filterDropdownOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-20">
              <div className="p-3">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Sector
                  </label>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  >
                    <option value="">All Sectors</option>
                    {sectors.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Industry
                  </label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  >
                    <option value="">All Industries</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
                
                {(selectedSector || selectedIndustry) && (
                  <button
                    onClick={clearFilters}
                    className="w-full px-3 py-2 text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {dropdownOpen && filteredStocks.length > 0 && (
        <div className="absolute mt-1 w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10 max-h-96 overflow-y-auto">
          {filteredStocks.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => handleSelectStock(stock.symbol)}
              className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-800 dark:text-white">
                    {stock.symbol}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {stock.name}
                  </div>
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500">
                  {stock.sector}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {dropdownOpen && searchTerm && filteredStocks.length === 0 && (
        <div className="absolute mt-1 w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10 p-4 text-center text-slate-500 dark:text-slate-400">
          No stocks found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default StockSelector;