import React, { useState } from 'react';
import { BarChart2, TrendingUp, Activity } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { StockData } from '../types';

interface HistoricalAnalysisProps {
  data: StockData[];
  symbol: string;
}

const HistoricalAnalysis: React.FC<HistoricalAnalysisProps> = ({ data, symbol }) => {
  const [selectedMetric, setSelectedMetric] = useState<'returns' | 'volatility' | 'volume'>('returns');

  const calculateMetrics = () => {
    const returns: number[] = [];
    const volatility: number[] = [];
    const volume: number[] = [];
    const dates: string[] = [];

    for (let i = 1; i < data.length; i++) {
      const dailyReturn = ((data[i].close - data[i-1].close) / data[i-1].close) * 100;
      returns.push(dailyReturn);
      
      // Calculate 10-day rolling volatility
      if (i >= 10) {
        const returnSlice = returns.slice(i-10, i);
        const mean = returnSlice.reduce((a, b) => a + b, 0) / returnSlice.length;
        const variance = returnSlice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returnSlice.length;
        volatility.push(Math.sqrt(variance));
      } else {
        volatility.push(0);
      }
      
      volume.push(data[i].volume);
      dates.push(data[i].date);
    }

    return { returns, volatility, volume, dates };
  };

  const metrics = calculateMetrics();

  const chartData = {
    labels: metrics.dates,
    datasets: [
      {
        label: selectedMetric === 'returns' ? 'Daily Returns (%)' :
               selectedMetric === 'volatility' ? '10-Day Volatility' :
               'Volume',
        data: selectedMetric === 'returns' ? metrics.returns :
              selectedMetric === 'volatility' ? metrics.volatility :
              metrics.volume,
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          tooltipFormat: 'MMM d, yyyy',
        },
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(226, 232, 240, 0.5)',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Historical Analysis - {symbol}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedMetric('returns')}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 ${
              selectedMetric === 'returns'
                ? 'bg-sky-100 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <TrendingUp size={16} />
            <span>Returns</span>
          </button>
          <button
            onClick={() => setSelectedMetric('volatility')}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 ${
              selectedMetric === 'volatility'
                ? 'bg-sky-100 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Activity size={16} />
            <span>Volatility</span>
          </button>
          <button
            onClick={() => setSelectedMetric('volume')}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 ${
              selectedMetric === 'volume'
                ? 'bg-sky-100 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <BarChart2 size={16} />
            <span>Volume</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
        <div className="h-[400px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Average Daily Return"
          value={`${(metrics.returns.reduce((a, b) => a + b, 0) / metrics.returns.length).toFixed(2)}%`}
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          title="Average Volatility"
          value={`${(metrics.volatility.reduce((a, b) => a + b, 0) / metrics.volatility.length).toFixed(2)}`}
          icon={<Activity size={20} />}
        />
        <StatCard
          title="Average Daily Volume"
          value={`${(metrics.volume.reduce((a, b) => a + b, 0) / metrics.volume.length).toLocaleString()}`}
          icon={<BarChart2 size={20} />}
        />
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
        <div className="p-2 bg-sky-50 dark:bg-sky-900/20 rounded-lg text-sky-600 dark:text-sky-400">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-800 dark:text-white">{value}</div>
    </div>
  );
};

export default HistoricalAnalysis;