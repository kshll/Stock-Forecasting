import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { RefreshCw } from 'lucide-react';
import { StockData } from '../types';

Chart.register(...registerables);

interface StockChartProps {
  data: StockData[];
  symbol: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, symbol }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [showVolume, setShowVolume] = useState(true);
  const [showMA50, setShowMA50] = useState(true);
  const [showMA200, setShowMA200] = useState(true);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Calculate moving averages
    const ma50Data = calculateMovingAverage(data, 50);
    const ma200Data = calculateMovingAverage(data, 200);

    const chartDataConfig = {
      labels: data.map(item => new Date(item.date)),
      datasets: [
        {
          label: symbol,
          data: data.map(item => item.close),
          borderColor: 'rgb(14, 165, 233)',
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgb(14, 165, 233)',
          fill: false,
          tension: 0.1,
          yAxisID: 'y',
        },
        showMA50 ? {
          label: '50-Day MA',
          data: ma50Data.map(item => item?.value),
          borderColor: 'rgb(249, 115, 22)',
          borderWidth: 1.5,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          tension: 0.1,
          borderDash: [5, 5],
          yAxisID: 'y',
        } : null,
        showMA200 ? {
          label: '200-Day MA',
          data: ma200Data.map(item => item?.value),
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 1.5,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          tension: 0.1,
          borderDash: [2, 2],
          yAxisID: 'y',
        } : null,
        showVolume ? {
          label: 'Volume',
          data: data.map(item => item.volume),
          backgroundColor: 'rgba(148, 163, 184, 0.3)',
          borderWidth: 0,
          type: 'bar',
          yAxisID: 'y1',
        } : null,
      ].filter(Boolean),
    };

    setChartData(chartDataConfig);
  }, [data, symbol, showVolume, showMA50, showMA200]);

  const calculateMovingAverage = (data: StockData[], window: number) => {
    return data.map((item, index) => {
      if (index < window - 1) return { date: item.date, value: null };
      
      const slice = data.slice(index - window + 1, index + 1);
      const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
      return { date: item.date, value: sum / window };
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          tooltipFormat: 'MMM d, yyyy',
          displayFormats: {
            day: 'MMM d',
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        position: 'left' as const,
        grid: {
          color: 'rgba(226, 232, 240, 0.5)',
        },
        ticks: {
          callback: (value: any) => {
            return '$' + value.toFixed(2);
          },
        },
      },
      y1: {
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: (value: any) => {
            if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
            if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K';
            return value;
          },
        },
        display: showVolume,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            if (label === 'Volume') {
              let value = context.parsed.y;
              if (value >= 1_000_000) return label + ': ' + (value / 1_000_000).toFixed(2) + 'M';
              if (value >= 1_000) return label + ': ' + (value / 1_000).toFixed(2) + 'K';
              return label + ': ' + value;
            }
            return label + ': $' + context.parsed.y.toFixed(2);
          },
        },
      },
    },
  };

  return (
    <div className="h-[400px]">
      <div className="flex justify-end mb-3 space-x-4">
        <div className="flex items-center space-x-2">
          <label className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={showVolume}
              onChange={() => setShowVolume(!showVolume)}
              className="mr-1 rounded text-sky-500"
            />
            Volume
          </label>
          <label className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={showMA50}
              onChange={() => setShowMA50(!showMA50)}
              className="mr-1 rounded text-sky-500"
            />
            MA(50)
          </label>
          <label className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={showMA200}
              onChange={() => setShowMA200(!showMA200)}
              className="mr-1 rounded text-sky-500"
            />
            MA(200)
          </label>
        </div>
        <button 
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
          title="Refresh Chart"
        >
          <RefreshCw size={16} />
        </button>
      </div>
      
      {chartData ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
          No data available
        </div>
      )}
    </div>
  );
};

export default StockChart;