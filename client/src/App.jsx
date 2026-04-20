import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TopHeader from './components/TopHeader';
import Terminal from './components/Pages/Terminal';
import Markets from './components/Pages/Markets';
import AiSettings from './components/Pages/AiSettings';
import WatchlistPage from './components/Pages/WatchlistPage';
import Auth from './components/Pages/Auth';


export default function App() {
  const [token, setToken] = useState(localStorage.getItem('stocky_token') || null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('stocky_theme') || 'light');
  const userStr = localStorage.getItem('stocky_user');
  const user = userStr ? JSON.parse(userStr) : {};

  useEffect(() => {
    localStorage.setItem('stocky_theme', themeMode);
    if (themeMode === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [themeMode]);

  const toastOptions = {
    style: {
      background: '#ffffff',
      color: '#111827',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '12px',
      fontFamily: 'Inter, sans-serif',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    },
    success: { iconTheme: { primary: '#2563eb', secondary: '#ffffff' } },
    error: { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
  };

  if (!token) {
    return (
      <Router>
        <div className="bg-background text-on-surface dark:bg-[#111316] dark:text-[#e2e2e6] font-body h-screen flex flex-col overflow-hidden">
          <Toaster position="top-center" toastOptions={toastOptions} />
          <Auth setTokens={setToken} />
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="bg-background text-on-surface dark:bg-[#111316] dark:text-[#e2e2e6] font-body h-screen w-screen flex overflow-hidden">
        <Toaster position="top-center" toastOptions={toastOptions} />

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar Navigation */}
        <Navbar isOpen={sidebarOpen} setOpen={setSidebarOpen} />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-background dark:bg-[#111316] h-screen overflow-hidden">
          <TopHeader user={user} setToken={setToken} setSidebarOpen={setSidebarOpen} themeMode={themeMode} setThemeMode={setThemeMode} />
          
          <main className="flex-1 overflow-hidden p-6 md:p-8 flex flex-col min-h-0">
            <Routes>
              <Route path="/" element={<Terminal />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/ai" element={<AiSettings />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
