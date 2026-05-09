import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { StockData, PredictionData } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface PredictionChartProps {
  historicalData: StockData[];
  predictions: PredictionData[];
  symbol: string;
}

interface ChartDataConfig {
  labels: (Date | null)[];
  datasets: Record<string, unknown>[];
}

const PredictionChart: React.FC<PredictionChartProps> = ({ 
  historicalData, 
  predictions,
  symbol
}) => {
  const [chartData, setChartData] = useState<ChartDataConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [trainButtonDisabled, setTrainButtonDisabled] = useState(false);

  useEffect(() => {
    if (historicalData.length === 0) return;
    
    const historicalDates = historicalData.map(d => new Date(d.date));
    const historicalPrices = historicalData.map(d => d.close);
    
    // Create prediction dates (future dates after historical data)
    const lastDate = new Date(historicalData[historicalData.length - 1].date);
    const predictionDates = predictions.map((_, i) => {
      const date = new Date(lastDate);
      date.setDate(date.getDate() + i + 1);
      return date;
    });
    
    // Create confidence interval data (upper and lower bounds)
    const confidenceUpper = predictions.map(p => p.value + p.confidence);
    const confidenceLower = predictions.map(p => p.value - p.confidence);
    
    const chartDataConfig: ChartDataConfig = {
      labels: [...historicalDates, ...predictionDates],
      datasets: [
        {
          label: 'Historical',
          data: [...historicalPrices, ...Array(predictions.length).fill(null)],
          borderColor: 'rgb(14, 165, 233)',
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: false,
        },
        {
          label: 'Predicted',
          data: [...Array(historicalData.length).fill(null), ...predictions.map(p => p.value)],
          borderColor: 'rgb(249, 115, 22)',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: false,
        },
        {
          label: 'Upper Bound',
          data: [...Array(historicalData.length).fill(null), ...confidenceUpper],
          borderColor: 'rgba(249, 115, 22, 0.3)',
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderDash: [3, 3],
          pointRadius: 0,
          fill: '+2',
          tension: 0.1,
        },
        {
          label: 'Lower Bound',
          data: [...Array(historicalData.length).fill(null), ...confidenceLower],
          borderColor: 'rgba(249, 115, 22, 0.3)',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          borderWidth: 1,
          borderDash: [3, 3],
          pointRadius: 0,
          fill: false,
          tension: 0.1,
        },
      ],
    };
    
    setChartData(chartDataConfig);
    
    // Calculate model accuracy based on test data
    if (historicalData.length > 30 && predictions.length > 0) {
      // Calculate RMSE on last 30 days vs predictions
      const actual = historicalData.slice(-30).map(d => d.close);
      const predicted = predictions.slice(0, 30).map(p => p.value);
      const squaredErrors = actual.map((val, i) => {
        if (i >= predicted.length) return 0;
        return Math.pow(val - predicted[i], 2);
      });
      const mse = squaredErrors.reduce((sum, val) => sum + val, 0) / actual.length;
      const rmse = Math.sqrt(mse);
      const maxPrice = Math.max(...actual);
      const minPrice = Math.min(...actual);
      const priceRange = maxPrice - minPrice;
      
      // Normalized accuracy as percentage
      const accuracyPercent = 100 * (1 - (rmse / priceRange));
      setAccuracy(Math.min(Math.max(accuracyPercent, 0), 100));
    }
  }, [historicalData, predictions]);

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
        grid: {
          color: 'rgba(226, 232, 240, 0.5)',
        },
        ticks: {
          callback: (value: string | number) => {
            return '$' + Number(value).toFixed(2);
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: { dataset: { label?: string }; parsed: { y: number } }) => {
            const label = context.dataset.label || '';
            if (label === 'Upper Bound' || label === 'Lower Bound') {
              return label + ': $' + context.parsed.y.toFixed(2);
            }
            return label + ': $' + context.parsed.y.toFixed(2);
          },
        },
      },
    },
  };

  const handleTrainModel = () => {
    setIsLoading(true);
    setTrainButtonDisabled(true);
    
    // Simulate model training delay
    setTimeout(() => {
      setIsLoading(false);
      setTrainButtonDisabled(false);
    }, 3000);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
        <div className="mb-3 md:mb-0">
          <h3 className="text-lg font-medium text-slate-800 dark:text-white">
            {symbol} Price Prediction
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            LSTM model predicting future stock prices
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {accuracy !== null && (
            <div className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-sm">
              <span className="font-medium">Model Accuracy:</span>{' '}
              <span className={`font-bold ${
                accuracy > 70 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : accuracy > 50 
                    ? 'text-amber-600 dark:text-amber-400' 
                    : 'text-red-600 dark:text-red-400'
              }`}>
                {accuracy.toFixed(1)}%
              </span>
            </div>
          )}
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center`}
            onClick={handleTrainModel}
            disabled={trainButtonDisabled || historicalData.length < 60}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" /> Training...
              </>
            ) : (
              'Retrain Model'
            )}
          </button>
        </div>
      </div>
      
      <div className="h-[400px]">
        {chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
            No prediction data available
          </div>
        )}
      </div>
      
      <div className="mt-5 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 text-sm">
        <h4 className="font-medium text-slate-800 dark:text-white mb-2">Model Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-slate-500 dark:text-slate-400">Model Type</p>
            <p className="font-medium text-slate-800 dark:text-white">LSTM Neural Network</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Features</p>
            <p className="font-medium text-slate-800 dark:text-white">Price, Volume, MA(50), MA(200)</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Training Period</p>
            <p className="font-medium text-slate-800 dark:text-white">
              {historicalData.length} days
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Prediction Horizon</p>
            <p className="font-medium text-slate-800 dark:text-white">30 days</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Confidence Interval</p>
            <p className="font-medium text-slate-800 dark:text-white">95%</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Last Updated</p>
            <p className="font-medium text-slate-800 dark:text-white">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionChart;