import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  exchange: {
    type: String,
    default: 'NASDAQ',
    trim: true,
  },
  assetType: {
    type: String,
    enum: ['Stock', 'Crypto', 'ETF'],
    default: 'Stock',
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);
export default Watchlist;
