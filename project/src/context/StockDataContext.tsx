import React, { createContext, useState, useEffect } from 'react';
import { predictStockPrices } from '../utils/stockModel';
import { StockData, DateRange, StockMetrics, PredictionData } from '../types';
import { mockStockData } from '../data/mockStockData';
import { calculateMetrics } from '../utils/stockAnalysis';

interface StockDataContextType {
  stockData: StockData[];
  loading: boolean;
  error: string | null;
  selectedStock: string;
  setSelectedStock: (symbol: string) => void;
  dateRange: DateRange | null;
  setDateRange: (range: DateRange) => void;
  fetchStockData: () => void;
  metrics: StockMetrics | null;
  predictions: PredictionData[] | null;
}

export const StockDataContext = createContext<StockDataContextType>({
  stockData: [],
  loading: false,
  error: null,
  selectedStock: '',
  setSelectedStock: () => {},
  dateRange: null,
  setDateRange: () => {},
  fetchStockData: () => {},
  metrics: null,
  predictions: null,
});

interface StockDataProviderProps {
  children: React.ReactNode;
}

export const StockDataProvider: React.FC<StockDataProviderProps> = ({ children }) => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<string>('AAPL');
  const [dateRange, setDateRange] = useState<DateRange | null>({
    startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    endDate: new Date(),
  });
  const [metrics, setMetrics] = useState<StockMetrics | null>(null);
  const [predictions, setPredictions] = useState<PredictionData[] | null>(null);

  const fetchStockData = async () => {
    if (!selectedStock || !dateRange) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, you would fetch from an API
      // For now, we use mock data
      const mockData = mockStockData(selectedStock, dateRange);
      
      // Wait a bit to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStockData(mockData);
      
      // Calculate metrics
      const calculatedMetrics = calculateMetrics(mockData);
      setMetrics(calculatedMetrics);
      
      // Generate predictions
      const preds = predictStockPrices(mockData, 30);
      setPredictions(preds);
    } catch (err) {
      setError('Failed to fetch stock data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    if (selectedStock && dateRange) {
      fetchStockData();
    }
  }, []);

  return (
    <StockDataContext.Provider value={{
      stockData,
      loading,
      error,
      selectedStock,
      setSelectedStock,
      dateRange,
      setDateRange,
      fetchStockData,
      metrics,
      predictions,
    }}>
      {children}
    </StockDataContext.Provider>
  );
};