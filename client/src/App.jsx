import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dock from './components/ui/Dock';
import Terminal from './components/Pages/Terminal';
import Markets from './components/Pages/Markets';
import Insights from './components/Pages/Insights';
import AiSettings from './components/Pages/AiSettings';
import WatchlistPage from './components/Pages/WatchlistPage';

export default function App() {
  const [activeWhale, setActiveWhale] = useState(null);

  return (
    <Router>
      <div className="dark bg-background text-on-surface font-body h-screen flex flex-col overflow-hidden">
        {/* Toast notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1e2023',
              color: '#e2e2e6',
              border: '1px solid rgba(58,74,70,0.2)',
              borderRadius: '12px',
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif',
            },
            success: { iconTheme: { primary: '#26fedc', secondary: '#111316' } },
            error: { iconTheme: { primary: '#ffb4ab', secondary: '#111316' } },
          }}
        />

        {/* Navigation + ticker bar */}
        <Navbar />

        {/* ── Main Routing Region ─────────────────────────── */}
        {/* mt-[88px] = 64px (navbar) + 24px (ticker) */}
        {/* min-h-0 is the key fix: allows flex children to have overflow-y-auto */}
        <main className="flex-1 mt-[88px] flex overflow-hidden p-4 gap-4 pb-28 min-h-0">
          <Routes>
            <Route path="/" element={<Terminal activeWhale={activeWhale} setActiveWhale={setActiveWhale} />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/ai" element={<AiSettings />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
          </Routes>
        </main>

        {/* Floating Dock */}
        <Dock />
      </div>
    </Router>
  );
}
