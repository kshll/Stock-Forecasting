import React, { useState } from 'react';
import { TrendingUp, Calendar, BarChart2, PieChart } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import HistoricalAnalysis from './components/HistoricalAnalysis';
import Portfolio from './components/Portfolio';
import { StockDataProvider } from './context/StockDataContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');

  const sidebarItems = [
    { icon: <TrendingUp size={18} />, label: 'Dashboard', id: 'dashboard' },
    { icon: <Calendar size={18} />, label: 'Historical', id: 'historical' },
    { icon: <BarChart2 size={18} />, label: 'Analysis', id: 'analysis' },
    { icon: <PieChart size={18} />, label: 'Portfolio', id: 'portfolio' }
  ];

  return (
    <ThemeProvider>
      <StockDataProvider>
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
          <Header toggleSidebar={() => setShowSidebar(!showSidebar)} />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar 
              show={showSidebar} 
              items={sidebarItems.map(item => ({
                ...item,
                active: item.id === activeView,
                onClick: () => setActiveView(item.id)
              }))} 
            />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {activeView === 'dashboard' && <Dashboard />}
              {activeView === 'historical' && <HistoricalAnalysis data={[]} symbol="" />}
              {activeView === 'portfolio' && <Portfolio />}
            </main>
          </div>
        </div>
      </StockDataProvider>
    </ThemeProvider>
  );
}

export default App;