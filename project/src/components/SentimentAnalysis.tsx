import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface SentimentAnalysisProps {
  symbol: string;
}

interface NewsItem {
  headline: string;
  source: string;
  url: string;
  date: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ symbol }) => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!symbol) return;
    
    setLoading(true);
    // Simulate fetching news data
    setTimeout(() => {
      const mockNewsData = generateMockNewsData(symbol);
      setNewsData(mockNewsData);
      setLoading(false);
    }, 1000);
  }, [symbol]);

  // Generate mock news data with sentiment scores
  const generateMockNewsData = (symbol: string): NewsItem[] => {
    const sources = ['Bloomberg', 'CNBC', 'Reuters', 'Financial Times', 'WSJ'];
    const positiveHeadlines = [
      `${symbol} Exceeds Earnings Expectations in Q2`,
      `${symbol} Announces New Product Launch, Stock Surges`,
      `Analysts Raise ${symbol} Price Target After Strong Results`,
      `${symbol} Expands into New Markets, Growth Outlook Positive`,
      `${symbol} Reports Record Revenue, Raises Full-Year Guidance`
    ];
    const neutralHeadlines = [
      `${symbol} Reports Q2 Results In Line With Expectations`,
      `${symbol} CEO Discusses Future Strategy in Interview`,
      `${symbol} to Present at Upcoming Industry Conference`,
      `What to Watch for in ${symbol}'s Upcoming Earnings Report`,
      `${symbol} Maintains Market Position Despite Industry Challenges`
    ];
    const negativeHeadlines = [
      `${symbol} Misses Profit Estimates, Shares Drop`,
      `${symbol} Faces Regulatory Scrutiny Over Business Practices`,
      `${symbol} Cuts Forecast Amid Economic Uncertainty`,
      `Investors Concerned About ${symbol}'s Slowing Growth`,
      `${symbol} Announces Restructuring, Layoffs Expected`
    ];
    
    const getRandomDate = () => {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 14));
      return date.toISOString().split('T')[0];
    };
    
    const news: NewsItem[] = [];
    
    // Add 2-3 positive news
    for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
      news.push({
        headline: positiveHeadlines[i % positiveHeadlines.length],
        source: sources[Math.floor(Math.random() * sources.length)],
        url: '#',
        date: getRandomDate(),
        sentiment: 'positive',
        score: 0.7 + Math.random() * 0.3
      });
    }
    
    // Add 2-3 neutral news
    for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
      news.push({
        headline: neutralHeadlines[i % neutralHeadlines.length],
        source: sources[Math.floor(Math.random() * sources.length)],
        url: '#',
        date: getRandomDate(),
        sentiment: 'neutral',
        score: 0.4 + Math.random() * 0.2
      });
    }
    
    // Add 1-2 negative news
    for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
      news.push({
        headline: negativeHeadlines[i % negativeHeadlines.length],
        source: sources[Math.floor(Math.random() * sources.length)],
        url: '#',
        date: getRandomDate(),
        sentiment: 'negative',
        score: Math.random() * 0.3
      });
    }
    
    // Sort by date (newest first)
    news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return news;
  };

  // Calculate overall sentiment score
  const calculateOverallSentiment = () => {
    if (newsData.length === 0) return { score: 0, label: 'Neutral' };
    
    const totalScore = newsData.reduce((sum, news) => {
      // Convert to -1 to 1 scale
      let normalizedScore = news.sentiment === 'negative' 
        ? -1 * news.score 
        : news.sentiment === 'positive' 
          ? news.score 
          : 0;
      return sum + normalizedScore;
    }, 0);
    
    const averageScore = totalScore / newsData.length;
    
    let label = 'Neutral';
    if (averageScore > 0.3) label = 'Bullish';
    else if (averageScore > 0.1) label = 'Slightly Bullish';
    else if (averageScore < -0.3) label = 'Bearish';
    else if (averageScore < -0.1) label = 'Slightly Bearish';
    
    return { 
      score: averageScore, 
      label
    };
  };

  const sentiment = calculateOverallSentiment();
  
  // Calculate sentiment distribution percentages
  const sentimentDistribution = () => {
    if (newsData.length === 0) return { positive: 0, neutral: 0, negative: 0 };
    
    const counts = {
      positive: newsData.filter(news => news.sentiment === 'positive').length,
      neutral: newsData.filter(news => news.sentiment === 'neutral').length,
      negative: newsData.filter(news => news.sentiment === 'negative').length,
    };
    
    return {
      positive: (counts.positive / newsData.length) * 100,
      neutral: (counts.neutral / newsData.length) * 100,
      negative: (counts.negative / newsData.length) * 100,
    };
  };
  
  const distribution = sentimentDistribution();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-4">
        News Sentiment Analysis
      </h3>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : newsData.length > 0 ? (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Overall Sentiment
              </div>
              <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                sentiment.score > 0.1 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : sentiment.score < -0.1
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {sentiment.label}
              </div>
            </div>
            
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  sentiment.score > 0.1 
                    ? 'bg-emerald-500' 
                    : sentiment.score < -0.1 
                      ? 'bg-red-500' 
                      : 'bg-slate-400'
                }`}
                style={{ 
                  width: `${Math.min(Math.max((sentiment.score + 1) / 2 * 100, 0), 100)}%`,
                  transition: 'width 0.5s ease-in-out' 
                }}
              ></div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              Sentiment Distribution
            </div>
            <div className="flex h-4 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full"
                style={{ width: `${distribution.positive}%` }}
              ></div>
              <div 
                className="bg-slate-400 h-full"
                style={{ width: `${distribution.neutral}%` }}
              ></div>
              <div 
                className="bg-red-500 h-full"
                style={{ width: `${distribution.negative}%` }}
              ></div>
            </div>
            <div className="flex text-xs mt-1 text-slate-600 dark:text-slate-400">
              <div style={{ width: `${distribution.positive}%` }}>Positive</div>
              <div style={{ width: `${distribution.neutral}%` }} className="text-center">Neutral</div>
              <div style={{ width: `${distribution.negative}%` }} className="text-right">Negative</div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              Recent News
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {newsData.map((news, index) => (
                <div 
                  key={index}
                  className="pb-3 border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-sm font-medium text-slate-800 dark:text-white">
                      {news.headline}
                    </div>
                    <div className={`text-xs px-2 py-0.5 rounded-full ${
                      news.sentiment === 'positive' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : news.sentiment === 'negative'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {news.sentiment}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div>
                      {news.source} · {news.date}
                    </div>
                    <a 
                      href={news.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300"
                    >
                      <span className="mr-1">Read</span> 
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
          No news data available
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
        Note: Sentiment analysis is based on news headlines and may not reflect all market factors.
      </div>
    </div>
  );
};

export default SentimentAnalysis;