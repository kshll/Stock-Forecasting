import { StockData, DateRange } from '../types';

// Function to generate realistic mock stock data
export const mockStockData = (symbol: string, dateRange: DateRange): StockData[] => {
  const data: StockData[] = [];
  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);
  
  // Base prices for different stocks
  const basePrices: {[key: string]: number} = {
    'AAPL': 175,
    'MSFT': 380,
    'GOOGL': 150,
    'AMZN': 170,
    'TSLA': 220,
    'META': 470,
    'NVDA': 950,
    'JPM': 190,
  };
  
  // Default to AAPL if symbol not found
  const basePrice = basePrices[symbol] || 100;
  
  // Volatility factors for different stocks
  const volatilityFactors: {[key: string]: number} = {
    'AAPL': 0.015,
    'MSFT': 0.014,
    'GOOGL': 0.016,
    'AMZN': 0.020,
    'TSLA': 0.035,
    'META': 0.025,
    'NVDA': 0.030,
    'JPM': 0.018,
  };
  
  const volatility = volatilityFactors[symbol] || 0.02;
  
  // Trend factors (positive/negative)
  const trendFactors: {[key: string]: number} = {
    'AAPL': 0.0002,
    'MSFT': 0.0003,
    'GOOGL': 0.0001,
    'AMZN': 0.0001,
    'TSLA': -0.0001,
    'META': 0.0004,
    'NVDA': 0.0005,
    'JPM': 0.0001,
  };
  
  const trendFactor = trendFactors[symbol] || 0.0001;
  
  // Seasonal factor (slight sine wave pattern)
  const seasonalPeriod = 120; // Days
  
  // Current date for tracking
  const currentDate = new Date(startDate);
  let lastPrice = basePrice;
  
  while (currentDate <= endDate) {
    // Skip weekends
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }
    
    // Calculate days elapsed for trends
    const daysElapsed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Base random movement
    const randomFactor = (Math.random() - 0.5) * 2 * volatility;
    
    // Long-term trend
    const trendComponent = trendFactor * daysElapsed;
    
    // Seasonal component (sine wave)
    const seasonalComponent = Math.sin(2 * Math.PI * daysElapsed / seasonalPeriod) * volatility * 0.5;
    
    // Calculate price change
    const change = lastPrice * (randomFactor + trendComponent + seasonalComponent);
    
    // Calculate daily prices
    const open = lastPrice;
    const close = open + change;
    // High and low with additional intraday volatility
    const dailyVolatility = Math.abs(change) * 1.5;
    const high = Math.max(open, close) + (Math.random() * dailyVolatility);
    const low = Math.min(open, close) - (Math.random() * dailyVolatility);
    
    // Volume with some randomness
    const baseVolume = basePrice * 1000000 / 150; // Higher price stocks tend to have lower volume
    const volumeNoise = (Math.random() * 0.4) + 0.8; // 0.8 to 1.2
    const volumeChange = Math.abs(change) / lastPrice; // More volume on bigger moves
    const volume = Math.floor(baseVolume * volumeNoise * (1 + volumeChange * 10));
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: volume
    });
    
    // Update for next iteration
    lastPrice = close;
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
};