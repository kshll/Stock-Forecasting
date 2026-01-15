import { StockData, PredictionData } from '../types';

// Function to predict stock prices using a simplified model
// In a real application, you would use TensorFlow.js for LSTM modeling
export const predictStockPrices = (
  historicalData: StockData[], 
  daysToPredict: number
): PredictionData[] => {
  // If no historical data, return empty array
  if (!historicalData || historicalData.length < 60) {
    return [];
  }
  
  // Get the last n days of closing prices
  const closingPrices = historicalData.map(d => d.close);
  const lastPrice = closingPrices[closingPrices.length - 1];
  const lastDate = new Date(historicalData[historicalData.length - 1].date);
  
  // Calculate average daily change over last 30 days
  let sumChanges = 0;
  let sumSquaredChanges = 0;
  for (let i = closingPrices.length - 30; i < closingPrices.length; i++) {
    if (i > 0) {
      const dailyChange = (closingPrices[i] - closingPrices[i - 1]) / closingPrices[i - 1];
      sumChanges += dailyChange;
      sumSquaredChanges += dailyChange * dailyChange;
    }
  }
  const avgDailyChange = sumChanges / 30;
  
  // Calculate volatility (standard deviation of daily changes)
  const variance = sumSquaredChanges / 30 - (avgDailyChange * avgDailyChange);
  const volatility = Math.sqrt(variance);
  
  // Generate predictions
  const predictions: PredictionData[] = [];
  let predictedPrice = lastPrice;
  
  for (let i = 1; i <= daysToPredict; i++) {
    // Add some randomness to the trend
    const randomFactor = (Math.random() - 0.5) * volatility * predictedPrice;
    const trendFactor = avgDailyChange * predictedPrice;
    
    // Update predicted price with trend and randomness
    predictedPrice = predictedPrice + trendFactor + randomFactor;
    
    // Calculate confidence interval (wider as we predict further out)
    const confidence = volatility * predictedPrice * Math.sqrt(i) * 1.96; // 95% confidence
    
    // Calculate date
    const predictedDate = new Date(lastDate);
    predictedDate.setDate(lastDate.getDate() + i);
    
    // Skip weekends
    if (predictedDate.getDay() === 0) { // Sunday
      predictedDate.setDate(predictedDate.getDate() + 1);
    } else if (predictedDate.getDay() === 6) { // Saturday
      predictedDate.setDate(predictedDate.getDate() + 2);
    }
    
    predictions.push({
      date: predictedDate.toISOString().split('T')[0],
      value: parseFloat(predictedPrice.toFixed(2)),
      confidence: parseFloat(confidence.toFixed(2))
    });
  }
  
  return predictions;
};