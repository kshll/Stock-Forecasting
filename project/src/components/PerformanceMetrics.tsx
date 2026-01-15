import React from 'react';
import { StockData, DateRange, StockMetrics } from '../types';

interface PerformanceMetricsProps {
  data: StockData[];
  metrics: StockMetrics | null;
  dateRange: DateRange | null;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ data, metrics, dateRange }) => {
  if (!data || data.length === 0 || !metrics) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 h-full">
        <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-4">
          Performance Metrics
        </h3>
        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
          No data available for analysis
        </div>
      </div>
    );
  }

  const startPrice = data[0]?.close || 0;
  const endPrice = data[data.length - 1]?.close || 0;
  const priceChange = endPrice - startPrice;
  const percentChange = (priceChange / startPrice) * 100;

  const startDate = dateRange?.startDate ? new Date(dateRange.startDate).toLocaleDateString() : 'N/A';
  const endDate = dateRange?.endDate ? new Date(dateRange.endDate).toLocaleDateString() : 'N/A';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-4">
        Performance Metrics
      </h3>
      
      <div className="mb-6">
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
          Period: {startDate} to {endDate}
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-slate-800 dark:text-white">
            ${endPrice.toFixed(2)}
          </div>
          <div className={`flex items-center space-x-1 ${
            percentChange >= 0 
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-600 dark:text-red-400'
          }`}>
            <span className="text-lg font-medium">
              {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <MetricItem 
          label="Total Return" 
          value={`${metrics.totalReturn.toFixed(2)}%`}
          isPositive={metrics.totalReturn >= 0}
        />
        <MetricItem 
          label="Annualized Return" 
          value={`${metrics.annualizedReturn.toFixed(2)}%`}
          isPositive={metrics.annualizedReturn >= 0}
        />
        <MetricItem 
          label="Volatility" 
          value={`${metrics.volatility.toFixed(2)}%`}
        />
        <MetricItem 
          label="Sharpe Ratio" 
          value={metrics.sharpeRatio.toFixed(2)}
          isPositive={metrics.sharpeRatio >= 1}
        />
        <MetricItem 
          label="Max Drawdown" 
          value={`${metrics.maxDrawdown.toFixed(2)}%`}
          isNegative={true}
        />
        <MetricItem 
          label="Beta (vs S&P 500)" 
          value={metrics.beta.toFixed(2)}
          isPositive={metrics.beta <= 1}
          isNegative={metrics.beta > 1.5}
        />
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <h4 className="text-base font-medium text-slate-800 dark:text-white mb-3">
          Technical Indicators
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <MetricItem 
            label="RSI (14)" 
            value={metrics.rsi.toFixed(2)}
            isPositive={metrics.rsi > 50 && metrics.rsi < 70}
            isNegative={metrics.rsi > 70 || metrics.rsi < 30}
          />
          <MetricItem 
            label="MACD Signal" 
            value={metrics.macd.toFixed(3)}
            isPositive={metrics.macd > 0}
            isNegative={metrics.macd < 0}
          />
        </div>
      </div>
    </div>
  );
};

interface MetricItemProps {
  label: string;
  value: string | number;
  isPositive?: boolean;
  isNegative?: boolean;
}

const MetricItem: React.FC<MetricItemProps> = ({ label, value, isPositive, isNegative }) => {
  let valueClass = 'text-slate-800 dark:text-white';
  
  if (isPositive) {
    valueClass = 'text-emerald-600 dark:text-emerald-400';
  } else if (isNegative) {
    valueClass = 'text-red-600 dark:text-red-400';
  }
  
  return (
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`text-base font-medium ${valueClass}`}>{value}</p>
    </div>
  );
};

export default PerformanceMetrics;