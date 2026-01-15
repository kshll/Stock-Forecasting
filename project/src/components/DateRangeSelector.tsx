import React, { useContext, useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { StockDataContext } from '../context/StockDataContext';
import { DateRange } from '../types';

const DateRangeSelector: React.FC = () => {
  const { dateRange, setDateRange, fetchStockData } = useContext(StockDataContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Predefined periods
  const periods: { label: string; range: DateRange }[] = [
    { 
      label: '1M', 
      range: { 
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)), 
        endDate: new Date() 
      } 
    },
    { 
      label: '3M', 
      range: { 
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)), 
        endDate: new Date() 
      } 
    },
    { 
      label: '6M', 
      range: { 
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)), 
        endDate: new Date() 
      } 
    },
    { 
      label: '1Y', 
      range: { 
        startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), 
        endDate: new Date() 
      } 
    },
    { 
      label: '2Y', 
      range: { 
        startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 2)), 
        endDate: new Date() 
      } 
    },
    { 
      label: '5Y', 
      range: { 
        startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 5)), 
        endDate: new Date() 
      } 
    }
  ];

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Find the active period label
  const getActivePeriodLabel = (): string => {
    const start = dateRange?.startDate?.toISOString();
    const end = dateRange?.endDate?.toISOString();
    
    for (const period of periods) {
      if (
        period.range.startDate.toISOString().split('T')[0] === (start ? start.split('T')[0] : '') &&
        period.range.endDate.toISOString().split('T')[0] === (end ? end.split('T')[0] : '')
      ) {
        return period.label;
      }
    }
    
    return 'Custom';
  };

  const handleSelectPeriod = (range: DateRange) => {
    setDateRange(range);
    setDropdownOpen(false);
    fetchStockData();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors w-full sm:w-auto"
      >
        <Calendar size={16} className="text-slate-500 dark:text-slate-400" />
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {getActivePeriodLabel()}
        </span>
        <ChevronDown size={16} className="text-slate-500 dark:text-slate-400" />
      </button>
      
      {dropdownOpen && (
        <div className="absolute right-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10 w-48">
          <div className="py-1">
            {periods.map((period) => (
              <button
                key={period.label}
                onClick={() => handleSelectPeriod(period.range)}
                className={`w-full text-left px-4 py-2 text-sm ${
                  getActivePeriodLabel() === period.label
                    ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {period.label}
              </button>
            ))}
            <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
            <button
              className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => setDropdownOpen(false)}
            >
              Custom Range
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;