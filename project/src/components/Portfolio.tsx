import React, { useState } from 'react';
import { PieChart, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { stockList } from '../data/stockList';

interface Position {
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
}

const Portfolio: React.FC = () => {
  const [positions] = useState<Position[]>([
    { symbol: 'AAPL', shares: 100, avgPrice: 150.25, currentPrice: 175.50 },
    { symbol: 'MSFT', shares: 50, avgPrice: 280.75, currentPrice: 380.20 },
    { symbol: 'GOOGL', shares: 25, avgPrice: 120.50, currentPrice: 150.30 },
    { symbol: 'AMZN', shares: 30, avgPrice: 140.25, currentPrice: 170.80 },
  ]);

  const calculateTotalValue = () => {
    return positions.reduce((total, pos) => total + (pos.shares * pos.currentPrice), 0);
  };

  const calculateTotalGain = () => {
    return positions.reduce((total, pos) => {
      const positionGain = (pos.currentPrice - pos.avgPrice) * pos.shares;
      return total + positionGain;
    }, 0);
  };

  const totalValue = calculateTotalValue();
  const totalGain = calculateTotalGain();
  const gainPercentage = (totalGain / (totalValue - totalGain)) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-800 dark:text-white">
              Portfolio Value
            </h3>
            <div className="p-2 bg-sky-50 dark:bg-sky-900/20 rounded-lg text-sky-600 dark:text-sky-400">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-800 dark:text-white">
              Total Gain/Loss
            </h3>
            <div className={`p-2 rounded-lg ${
              totalGain >= 0 
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            }`}>
              {totalGain >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            </div>
          </div>
          <div className={`text-3xl font-bold ${
            totalGain >= 0 
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-600 dark:text-red-400'
          }`}>
            {totalGain >= 0 ? '+' : '-'}${Math.abs(totalGain).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className={`text-sm ${
            gainPercentage >= 0 
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-600 dark:text-red-400'
          }`}>
            {gainPercentage >= 0 ? '+' : ''}{gainPercentage.toFixed(2)}%
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-800 dark:text-white">
              Asset Allocation
            </h3>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
              <PieChart size={20} />
            </div>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {positions.length} positions
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-medium text-slate-800 dark:text-white">
            Positions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Shares</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Market Value</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gain/Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {positions.map((position) => {
                const stockInfo = stockList.find(s => s.symbol === position.symbol);
                const marketValue = position.shares * position.currentPrice;
                const gain = (position.currentPrice - position.avgPrice) * position.shares;
                const gainPercentage = ((position.currentPrice - position.avgPrice) / position.avgPrice) * 100;
                
                return (
                  <tr key={position.symbol} className="hover:bg-slate-50 dark:hover:bg-slate-700/25">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-white">
                      {position.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {stockInfo?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-800 dark:text-white">
                      {position.shares}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-800 dark:text-white">
                      ${position.avgPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-800 dark:text-white">
                      ${position.currentPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-800 dark:text-white">
                      ${marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className={gain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                        <div>${gain.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        <div className="text-xs">
                          {gainPercentage >= 0 ? '+' : ''}{gainPercentage.toFixed(2)}%
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;