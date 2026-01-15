import React, { useContext, useState } from 'react';
import { CalendarRange, Clock, TrendingUp, TrendingDown, Activity, Layers, BarChart2 } from 'lucide-react';
import StockChart from './StockChart';
import StockSelector from './StockSelector';
import DateRangeSelector from './DateRangeSelector';
import PredictionChart from './PredictionChart';
import PerformanceMetrics from './PerformanceMetrics';
import SentimentAnalysis from './SentimentAnalysis';
import { StockDataContext } from '../context/StockDataContext';
import LoadingSpinner from './LoadingSpinner';

const Dashboard: React.FC = () => {
  const { 
    stockData, 
    loading, 
    selectedStock, 
    dateRange,
    metrics,
    predictions
  } = useContext(StockDataContext);

  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Layers size={16} /> },
    { id: 'prediction', label: 'Prediction', icon: <TrendingUp size={16} /> },
    { id: 'analysis', label: 'Analysis', icon: <BarChart2 size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Stock Market Forecasting
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Predict future stock prices with machine learning
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <StockSelector />
          <DateRangeSelector />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : stockData && stockData.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              title="Current Price"
              value={`$${stockData[stockData.length - 1]?.close.toFixed(2)}`}
              change={metrics?.priceChange || 0}
              icon={<Clock size={20} />}
              color="sky"
            />
            <MetricCard 
              title="Return"
              value={`${metrics?.totalReturn.toFixed(2)}%`}
              change={metrics?.annualizedReturn || 0}
              suffix="annualized"
              icon={<TrendingUp size={20} />}
              color={metrics?.totalReturn >= 0 ? "emerald" : "red"}
            />
            <MetricCard 
              title="Volatility"
              value={`${metrics?.volatility.toFixed(2)}%`}
              icon={<Activity size={20} />}
              color="amber"
            />
            <MetricCard 
              title="Max Drawdown"
              value={`${metrics?.maxDrawdown.toFixed(2)}%`}
              icon={<TrendingDown size={20} />}
              color="red"
            />
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 dark:border-slate-700">
              <nav className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                        : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="p-4">
              {activeTab === 'overview' && (
                <StockChart data={stockData} symbol={selectedStock} />
              )}
              
              {activeTab === 'prediction' && (
                <PredictionChart 
                  historicalData={stockData} 
                  predictions={predictions || []}
                  symbol={selectedStock}
                />
              )}
              
              {activeTab === 'analysis' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PerformanceMetrics 
                    data={stockData} 
                    metrics={metrics} 
                    dateRange={dateRange}
                  />
                  <SentimentAnalysis symbol={selectedStock} />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-16 h-16 mb-4 text-slate-300 dark:text-slate-600">
            <TrendingUp size={64} />
          </div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">No Data Available</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Select a stock ticker and date range to view historical data and predictions
          </p>
        </div>
      )}
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  suffix?: string;
  icon: React.ReactNode;
  color: 'sky' | 'emerald' | 'amber' | 'red';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  suffix,
  icon, 
  color 
}) => {
  const colorMap = {
    sky: 'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5">
      <div className="flex justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{value}</h3>
        {change !== undefined && (
          <div className="flex items-center mt-1">
            <span className={`text-sm font-medium ${
              change >= 0 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </span>
            {suffix && (
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                {suffix}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;