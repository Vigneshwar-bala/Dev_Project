import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

export default function TopHeader({ user, setToken, setSidebarOpen, themeMode, setThemeMode }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef(null);
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  return (
    <header 
      ref={navRef}
      className="h-16 px-4 md:px-8 flex justify-between items-center border-b border-outline-variant dark:border-[#3a4a46] bg-surface dark:bg-[#111316] shrink-0 transition-colors"
    >
      {/* Hamburger menu for mobile */}
      <button 
        onClick={() => setSidebarOpen(true)}
        className="md:hidden mr-4 material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
        style={{ fontSize: '24px' }}
      >
        menu
      </button>

      {/* Search Bar - Center aligned conceptually, but flexed left here */}
      <div className="flex-1 flex max-w-xl hidden sm:flex">
        <div className="bg-surface-container dark:bg-[#1a1c1f] w-full px-4 py-2 rounded-lg border border-outline-variant dark:border-[#3a4a46] flex items-center gap-2 transition-colors">
          <span className="material-symbols-outlined text-sm text-secondary dark:text-[#b9cac4]" style={{fontSize:'18px'}}>search</span>
          <input
            className="bg-transparent border-none outline-none focus:ring-0 text-sm w-full text-on-surface dark:text-[#e2e2e6] placeholder:text-on-surface-variant/50 dark:placeholder:text-[#b9cac4]/50"
            placeholder="Search..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-8 relative">
        <div className="flex gap-4">
          <span 
            onClick={() => toggle('notif')}
            className={`material-symbols-outlined cursor-pointer transition-colors ${activeDropdown === 'notif' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`} 
            style={{fontSize:'22px'}}
          >
            notifications
          </span>
          <span 
            onClick={() => toggle('settings')}
            className={`material-symbols-outlined cursor-pointer transition-colors ${activeDropdown === 'settings' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`} 
            style={{fontSize:'22px'}}
          >
            settings
          </span>
        </div>

        <div className="h-6 w-px bg-outline-variant dark:bg-[#3a4a46]" />

        {/* Profile Avatar */}
        <div 
          onClick={() => toggle('profile')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
            {userInitial}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{user.name || 'John Smith'}</p>
            <p className="text-[10px] text-on-surface-variant">{user.email || 'user@example.com'}</p>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">expand_more</span>
        </div>

        {/* Settings Dropdown Placeholder */}
        {activeDropdown === 'settings' && (
          <div className="absolute top-12 right-0 w-64 bg-surface dark:bg-[#1e2023] rounded-xl shadow-lg border border-outline-variant dark:border-[#3a4a46] p-4 z-50 flex flex-col gap-4">
             <h3 className="text-xs font-bold font-headline text-on-surface dark:text-[#e2e2e6] uppercase tracking-widest mb-1">Preferences</h3>
             
             {/* Theme Toggle Button */}
             <div className="flex justify-between items-center p-3 rounded-lg bg-surface-container dark:bg-[#1a1c1f] border border-outline-variant/30 dark:border-[#3a4a46]/50">
               <span className="text-xs font-medium text-on-surface dark:text-[#e2e2e6]">Dark Theme</span>
               <div 
                 className={`w-10 h-6 rounded-full relative cursor-pointer border transition-colors ${themeMode === 'dark' ? 'bg-primary dark:bg-[#26fedc] border-primary dark:border-[#26fedc]' : 'bg-surface-variant dark:bg-[#333538] border-outline-variant dark:border-[#3a4a46]'}`}
                 onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
               >
                 <div className={`absolute top-[1.5px] w-4 h-4 bg-surface dark:bg-[#111316] rounded-full shadow-sm transition-transform duration-200 ${themeMode === 'dark' ? 'translate-x-[1.125rem] left-0' : 'translate-x-[2px] left-0'}`} />
               </div>
             </div>

             <div className="border-t border-outline-variant/20 dark:border-[#3a4a46]/50 pt-3">
               <NavLink to="/ai" onClick={() => setActiveDropdown(null)} className="flex items-center gap-2 text-xs font-medium text-primary dark:text-[#26fedc] hover:text-primary-fixed transition-colors">
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  Configure AI Rules
               </NavLink>
             </div>
          </div>
        )}

        {/* Profile Dropdown */}
        {activeDropdown === 'profile' && (
          <div className="absolute top-12 right-0 w-56 bg-surface dark:bg-[#1e2023] rounded-xl shadow-lg border border-outline-variant dark:border-[#3a4a46] p-2 z-50">
            <button 
              onClick={() => {
                localStorage.removeItem('stocky_token');
                localStorage.removeItem('stocky_user');
                window.location.reload();
              }} 
              className="flex items-center gap-2 text-sm text-error hover:bg-error-container hover:text-error transition-colors w-full p-2.5 rounded-lg"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Disconnect
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
