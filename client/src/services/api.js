import axios from 'axios';

const baseURL = import.meta.env.PROD 
  ? 'https://stocky-backend-aef8ezbxbsdcdhfv.eastasia-01.azurewebsites.net/api' 
  : '/api';

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Watchlist ────────────────────────────────────────────────────────────────
export const getWatchlist = () => api.get('/watchlist').then(r => r.data.data);

export const addToWatchlist = (item) => api.post('/watchlist', item).then(r => r.data.data);

export const removeFromWatchlist = (ticker) =>
  api.delete(`/watchlist/${ticker}`).then(r => r.data);

// ─── Sentiment / Gemini ───────────────────────────────────────────────────────
export const analyzeSentiment = (payload) =>
  api.post('/sentiment/analyze', payload).then(r => r.data.data);

// ─── Market Data ──────────────────────────────────────────────────────────────
export const getStockQuote = (ticker) =>
  api.get(`/market/quote/${ticker}`).then(r => r.data.data);

export const getCryptoQuote = (symbol) =>
  api.get(`/market/crypto/${symbol}`).then(r => r.data.data);

export const searchTickers = (query) =>
  api.get(`/market/search`, { params: { q: query } }).then(r => r.data.data);

export default api;
