# StockY Terminal 📈 — Financial Intelligence Dashboard

> A professional MERN stack application that correlates **Institutional Whale Trades** with real-time market sentiment powered by **Gemini 1.5 Flash AI**.

![StockY Dashboard](./code.html)

---

## 🧠 Technical Thesis

StockY is not just a dashboard — it is a demonstration of **industrial-standard, full-stack engineering** across every layer of the modern web stack. Every architectural decision was made to prove real-world competencies.

---

## 🏗️ Tech Stack

| Layer | Technology | Justification |
|-------|-----------|--------------|
| **Frontend** | React 18 + Vite | HMR-first dev experience, production-optimized bundling |
| **Styling** | Tailwind CSS v3 | Design token system for consistent, scalable UI |
| **Backend** | Node.js + Express | Lightweight REST API with ESM module support |
| **Database** | MongoDB Atlas + Mongoose | Document model fits financial trade data; ODM enforces schema |
| **AI Engine** | Google Gemini 1.5 Flash | Low-latency, token-efficient flash model for real-time inference |
| **Market Data** | Alpha Vantage API | Free-tier stock/crypto price feeds with in-memory TTL cache |
| **HTTP Client** | Axios | Interceptor-ready, consistent error handling across FE/BE |

---

## 🖥️ The "Tri-Panel" Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  STOCKY TERMINAL                    🔔  💼  ⚙️   [S]           │
├──────────┬──────────────────────────────────┬───────────────────┤
│  WHALE   │                                  │  GLOBAL           │
│  TRACKER │     CORRELATION ENGINE           │  WATCHLIST        │
│  (20%)   │          (55%)                   │  (25%)            │
│          │                                  │                   │
│ Buffett  │   ┌──── Sentiment Gauge ────┐    │  TSLA  $184  -1%  │
│ Pelosi   │   │         76             │     │  NVDA  $924  +5%  │
│ Saylor   │   │       BULLISH          │     │  AAPL  $173  +0%  │
│ Wood     │   └────────────────────────┘     │  BTC  $68K  +3%   │
│ Dalio    │                                  │  AMZN  $178  -1%  │
│          │   01. Insight from Gemini AI     │                   │
│          │   02. Market correlation logic   │  [Add Ticker...]  │
│          │   03. Risk/opportunity summary   │                   │
└──────────┴──────────────────────────────────┴───────────────────┘
```

---

## ⚡ Gemini Efficiency Strategy

The Gemini API is used **surgically** to minimize token consumption:

1. **Cache-First** — `InsightCache` (MongoDB TTL index, 24h) is checked before every Gemini call
2. **In-Memory Fallback** — If MongoDB is unavailable, a `Map()` with 24h TTL serves cached results
3. **On-Demand Only** — Gemini is triggered exclusively on user click (never on page load)
4. **Compact Prompt** — Prompt is under 120 input tokens; response is structured JSON
5. **Graceful Degradation** — On quota/error, intelligent fallback insights are returned and cached

---

## 🗄️ Mongoose Schemas

### `Watchlist.js`
```js
{ ticker, name, exchange, assetType, addedAt }
// Unique ticker constraint prevents duplicate entries
```

### `InsightCache.js`
```js
{ cacheKey, whaleName, ticker, score, bias, volatility, liquidity, insights[], createdAt }
// TTL index: expires: 86400 — auto-deleted after 24 hours by MongoDB
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/watchlist` | Fetch all tickers with live prices |
| `POST` | `/api/watchlist` | Add ticker (validates, fetches price) |
| `DELETE` | `/api/watchlist/:ticker` | Remove ticker |
| `POST` | `/api/sentiment/analyze` | Trigger Gemini analysis (cache-first) |
| `GET` | `/api/sentiment/cache/:key` | Check cache status for a whale+ticker key |
| `GET` | `/api/market/quote/:ticker` | Alpha Vantage stock quote proxy |
| `GET` | `/api/market/crypto/:symbol` | Alpha Vantage crypto quote proxy |

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Gemini API Key ([aistudio.google.com](https://aistudio.google.com/app/apikey))
- Alpha Vantage API Key ([alphavantage.co](https://www.alphavantage.co))

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/StockY.git
cd StockY

# 2. Configure environment
cp .env.example .env
# Fill in your MONGO_URI, GEMINI_API_KEY, ALPHA_VANTAGE_KEY

# 3. Start backend
cd server && npm install && npm run dev

# 4. Start frontend (new terminal)
cd client && npm install && npm run dev
```

App runs at: **http://localhost:5173**  
API runs at: **http://localhost:5000/api**

---

## 🔄 Git CI/CD Workflow

This project was built following a **commit-gated development workflow** that mirrors a professional Pull Request process:

```
Phase 1 ─── feat: express api + mongoose models + gemini cache
                │
Phase 2 ─── feat: tri-panel ui + tailwind design system
                │
Phase 3 ─── feat: full-stack integration + live data feeds
                │
Phase 4 ─── chore: readme + env template + production config
```

### Why This Matters
- **Every commit represents a functional milestone** — not just "saving work"
- **`.env` is gitignored** — secrets are never exposed in version history  
- **Commit messages follow Conventional Commits** (`feat:`, `fix:`, `chore:`) — industry standard for changelogs and semantic versioning
- **Branching from `main`** proves understanding of trunk-based development

---

## 🏆 6-Mark Industrial-Standard Proof Points

| # | Concept | Implementation |
|---|---------|---------------|
| 1 | **Async Race Condition Handling** | `useEffect` cleanup with `cancelled = true` flag prevents stale state updates |
| 2 | **Database TTL Indexing** | `InsightCache.createdAt` field uses Mongoose `expires: 86400` — auto-garbage collection |
| 3 | **API Rate Limit Strategy** | Alpha Vantage responses cached in `Map()` for 5 minutes; mock fallback on limit |
| 4 | **Graceful Degradation** | Full app works without MongoDB (in-memory store) and without Gemini (fallback insights) |
| 5 | **Vite Dev Proxy** | `/api` requests proxied to port 5000 — eliminates CORS, mirrors Nginx reverse proxy in production |
| 6 | **Commit-Gated CI/CD** | Permission-based Git workflow mimics real Pull Request review process |

---

## 📁 Project Structure

```
StockY/
├── .env                    # Secrets (gitignored)
├── .gitignore
├── README.md
├── server/                 # Node.js + Express + MongoDB
│   ├── config/db.js        # Connection with fast-fail + offline mode
│   ├── models/             # Watchlist.js, InsightCache.js
│   ├── routes/             # watchlist.js, sentiment.js, market.js
│   ├── services/           # geminiService.js, alphaVantageService.js
│   └── index.js
└── client/                 # React 18 + Vite + Tailwind CSS
    └── src/
        ├── components/
        │   ├── WhaleTracker/       # WhalePanel, WhaleCard
        │   ├── CorrelationEngine/  # EnginePanel, SentimentGauge, LogicSummary
        │   ├── Watchlist/          # WatchlistPanel, TickerItem, AddTickerBar
        │   └── ui/Dock.jsx
        ├── hooks/useWatchlist.js
        ├── services/api.js
        └── data/whales.js
```

---

*Built with ❤️ using MERN Stack + Gemini AI — StockY Terminal v1.0*
A project by Vigneshwar Balakumae for Full Stack PEP