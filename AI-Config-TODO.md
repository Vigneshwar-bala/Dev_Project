
# AI Config Page TODO

**Plan**: /ai page w/ real-time thresholds + cache reset.

Steps:
- [x] 1. Create client/src/components/Pages/AiSettings.jsx (sliders: score min, volatility, Save to /api/config, Reset /purge)
- [x] 2. App.jsx: Add import/Route path="/ai"
- [x] 3. Navbar.jsx: Add AI Config link
- [x] 4. Dock.jsx: Add psychology /ai item
- [x] 5. Backend routes/config.js POST /api/config (User model prefs)
- [x] 6. openrouterService.js + User.js: Real-time threshold/volatility filter


