export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface StockMetrics {
  totalReturn: number;        // Total return over the period in percent
  annualizedReturn: number;   // Annualized return in percent
  volatility: number;         // Volatility (standard deviation) in percent
  sharpeRatio: number;        // Sharpe ratio (risk-adjusted return)
  maxDrawdown: number;        // Maximum drawdown in percent
  beta: number;               // Beta relative to market (e.g., S&P 500)
  rsi: number;                // Relative Strength Index
  macd: number;               // Moving Average Convergence Divergence
}

export interface PredictionData {
  date: string;
  value: number;
  confidence: number;         // Confidence interval
}