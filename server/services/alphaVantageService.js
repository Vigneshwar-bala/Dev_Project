import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const AV_BASE = 'https://www.alphavantage.co/query';
const API_KEY = process.env.ALPHA_VANTAGE_KEY;

// In-memory price cache (5 min TTL) to stay within AV free tier limits (5 req/min)
const priceCache = new Map();
const PRICE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const getFromCache = (key) => {
  const entry = priceCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > PRICE_TTL_MS) {
    priceCache.delete(key);
    return null;
  }
  return entry.data;
};

export const getStockQuote = async (ticker) => {
  const key = `stock_${ticker}`;
  const cached = getFromCache(key);
  if (cached) return cached;

  try {
    const { data } = await axios.get(AV_BASE, {
      params: { function: 'GLOBAL_QUOTE', symbol: ticker, apikey: API_KEY },
    });

    const quote = data['Global Quote'];
    if (!quote || !quote['05. price']) {
      // Return mock data if AV limit hit (free tier protection)
      return getMockQuote(ticker);
    }

    const result = {
      ticker: ticker.toUpperCase(),
      price: parseFloat(quote['05. price']).toFixed(2),
      change: parseFloat(quote['09. change']).toFixed(2),
      changePercent: quote['10. change percent']?.replace('%', '').trim() || '0.00',
      volume: parseInt(quote['06. volume'] || 0).toLocaleString(),
    };

    priceCache.set(key, { data: result, timestamp: Date.now() });
    return result;
  } catch (err) {
    console.error(`AV quote error for ${ticker}: ${err.message}`);
    return getMockQuote(ticker);
  }
};

export const getCryptoQuote = async (symbol) => {
  const key = `crypto_${symbol}`;
  const cached = getFromCache(key);
  if (cached) return cached;

  try {
    const { data } = await axios.get(AV_BASE, {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: symbol,
        to_currency: 'USD',
        apikey: API_KEY,
      },
    });

    const rate = data['Realtime Currency Exchange Rate'];
    if (!rate) return getMockCrypto(symbol);

    const result = {
      ticker: symbol.toUpperCase(),
      price: parseFloat(rate['5. Exchange Rate']).toFixed(2),
      change: '0.00',
      changePercent: '0.00',
    };

    priceCache.set(key, { data: result, timestamp: Date.now() });
    return result;
  } catch (err) {
    console.error(`AV crypto error for ${symbol}: ${err.message}`);
    return getMockCrypto(symbol);
  }
};

// Fallback mock data when AV rate limit is reached
const mockPrices = {
  TSLA: { price: '184.22', change: '-2.31', changePercent: '-1.24' },
  AAPL: { price: '173.50', change: '0.73', changePercent: '0.42' },
  NVDA: { price: '924.30', change: '43.15', changePercent: '4.88' },
  AMZN: { price: '178.15', change: '-0.99', changePercent: '-0.55' },
  OXY:  { price: '62.40', change: '1.20', changePercent: '1.96' },
  MSFT: { price: '415.32', change: '3.22', changePercent: '0.78' },
  META: { price: '508.80', change: '-4.10', changePercent: '-0.80' },
  GOOGL:{ price: '173.11', change: '1.50', changePercent: '0.87' },
  RELIANCE: { price: '2985.40', change: '45.20', changePercent: '1.80' },
  TCS: { price: '3890.15', change: '-12.50', changePercent: '-0.30' },
  HDFCBANK: { price: '1520.80', change: '8.40', changePercent: '0.50' },
  INFY: { price: '1445.60', change: '30.15', changePercent: '2.10' },
};

const getMockQuote = (ticker) => ({
  ticker: ticker.toUpperCase(),
  price: mockPrices[ticker]?.price || (Math.random() * 200 + 50).toFixed(2),
  change: mockPrices[ticker]?.change || '0.00',
  changePercent: mockPrices[ticker]?.changePercent || '0.00',
  volume: 'N/A',
  isMock: true,
});

const getMockCrypto = (symbol) => ({
  ticker: symbol.toUpperCase(),
  price: symbol === 'BTC' ? '68412.00' : symbol === 'ETH' ? '3521.00' : '1.00',
  change: '0.00',
  changePercent: '0.00',
  isMock: true,
});
