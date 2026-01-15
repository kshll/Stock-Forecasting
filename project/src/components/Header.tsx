import React, { useContext } from 'react';
import { Menu, Moon, Sun, Search } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 shadow-sm z-10">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white mr-2"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center">
          <TrendingUpIcon className="h-6 w-6 text-sky-500 mr-2" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">StockPredict</h1>
        </div>
      </div>
      
      <div className="hidden md:flex items-center relative mx-4 flex-1 max-w-xl">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search for stocks..."
          className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="h-8 w-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-medium">
          JP
        </div>
      </div>
    </header>
  );
};

// Custom icon component
const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

export default Header;