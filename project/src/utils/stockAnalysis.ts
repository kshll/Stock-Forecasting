import { StockData, StockMetrics } from '../types';

export const calculateMetrics = (data: StockData[]): StockMetrics => {
  if (!data || data.length < 2) {
    return {
      totalReturn: 0,
      annualizedReturn: 0,
      volatility: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      beta: 1,
      rsi: 50,
      macd: 0
    };
  }

  // Calculate daily returns
  const returns: number[] = [];
  for (let i = 1; i < data.length; i++) {
    const dailyReturn = (data[i].close - data[i-1].close) / data[i-1].close;
    returns.push(dailyReturn);
  }

  // Total return
  const firstPrice = data[0].close;
  const lastPrice = data[data.length - 1].close;
  const totalReturn = ((lastPrice - firstPrice) / firstPrice) * 100;

  // Annualized return
  const yearFraction = data.length / 252; // Assuming ~252 trading days per year
  const annualizedReturn = (Math.pow(1 + totalReturn / 100, 1 / yearFraction) - 1) * 100;

  // Volatility (standard deviation of returns, annualized)
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
  const dailyVolatility = Math.sqrt(variance);
  const annualizedVolatility = dailyVolatility * Math.sqrt(252) * 100;

  // Sharpe Ratio (using 2% as risk-free rate)
  const riskFreeRate = 0.02;
  const excessReturn = annualizedReturn / 100 - riskFreeRate;
  const sharpeRatio = excessReturn / (annualizedVolatility / 100);

  // Maximum Drawdown
  let maxDrawdown = 0;
  let peak = data[0].close;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i].close > peak) {
      peak = data[i].close;
    } else {
      const drawdown = (peak - data[i].close) / peak * 100;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
  }

  // Beta (simulated for mock data)
  // In a real application, you would compare against S&P 500 or another benchmark
  const beta = 0.8 + Math.random() * 0.8; // Random between 0.8 and 1.6

  // RSI (14-day)
  const rsi = calculateRSI(data, 14);

  // MACD
  const macd = calculateMACD(data);

  return {
    totalReturn,
    annualizedReturn,
    volatility: annualizedVolatility,
    sharpeRatio,
    maxDrawdown,
    beta,
    rsi,
    macd
  };
};

// Calculate RSI
function calculateRSI(data: StockData[], period: number = 14): number {
  if (data.length <= period) {
    return 50; // Default neutral value
  }

  let gains = 0;
  let losses = 0;

  // Calculate average gains and losses over the first 'period' days
  for (let i = 1; i <= period; i++) {
    const change = data[data.length - i].close - data[data.length - i - 1].close;
    if (change >= 0) {
      gains += change;
    } else {
      losses -= change; // Convert to positive
    }
  }

  // Calculate initial averages
  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Smooth averages for remaining data
  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change >= 0) {
      avgGain = (avgGain * (period - 1) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) - change) / period;
    }
  }

  // Calculate RS and RSI
  const rs = avgLoss > 0 ? avgGain / avgLoss : 100;
  const rsi = 100 - (100 / (1 + rs));

  return rsi;
}

// Calculate MACD
function calculateMACD(data: StockData[]): number {
  const shortPeriod = 12;
  const longPeriod = 26;
  
  if (data.length < longPeriod) {
    return 0;
  }

  const prices = data.map(d => d.close);
  
  // Calculate EMAs
  const shortEMA = calculateEMA(prices, shortPeriod);
  const longEMA = calculateEMA(prices, longPeriod);
  
  // MACD Line
  const macdLine = shortEMA - longEMA;
  
  // Signal Line (9-day EMA of MACD Line)
  const signalLine = 0; // Simplified
  
  // MACD Histogram
  return macdLine - signalLine;
}

// Calculate Exponential Moving Average
function calculateEMA(prices: number[], period: number): number {
  const k = 2 / (period + 1);
  let ema = prices[0];
  
  for (let i = 1; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  
  return ema;
}