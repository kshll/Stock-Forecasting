export interface StockInfo {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
}

export const stockList: StockInfo[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', industry: 'Consumer Electronics' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', industry: 'Software' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', industry: 'Internet Services' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical', industry: 'Internet Retail' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', industry: 'Semiconductors' },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', industry: 'Internet Services' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc.', sector: 'Financial Services', industry: 'Insurance' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial Services', industry: 'Banks' },
  { symbol: 'V', name: 'Visa Inc.', sector: 'Financial Services', industry: 'Credit Services' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', industry: 'Drug Manufacturers' },
  { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Defensive', industry: 'Retail' },
  { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Defensive', industry: 'Household Products' },
  { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financial Services', industry: 'Credit Services' },
  { symbol: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Cyclical', industry: 'Home Improvement' },
  { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Financial Services', industry: 'Banks' },
  { symbol: 'KO', name: 'Coca-Cola Co.', sector: 'Consumer Defensive', industry: 'Beverages' },
  { symbol: 'DIS', name: 'Walt Disney Co.', sector: 'Communication Services', industry: 'Entertainment' },
  { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', industry: 'Drug Manufacturers' },
  { symbol: 'CSCO', name: 'Cisco Systems Inc.', sector: 'Technology', industry: 'Communication Equipment' },
  // Add more stocks as needed
];

export const sectors = Array.from(new Set(stockList.map(stock => stock.sector))).sort();
export const industries = Array.from(new Set(stockList.map(stock => stock.industry))).sort();