import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Auth({ setTokens }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email: formData.email, password: formData.password } : formData;
      const baseURL = import.meta.env.PROD ? 'https://stocky-backend.azurewebsites.net' : 'http://localhost:5000';
      const res = await axios.post(`${baseURL}${endpoint}`, payload);

      if (res.data.success) {
        toast.success(isLogin ? 'Logged in successfully' : 'Registered successfully');
        localStorage.setItem('stocky_token', res.data.token);
        localStorage.setItem('stocky_user', JSON.stringify({ name: res.data.name, email: res.data.email, id: res.data._id }));
        setTokens(res.data.token);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-[#26fedc]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-surface/60 backdrop-blur-xl border border-surface-border rounded-2xl p-8 shadow-2xl">
          <div className="mb-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
              <span className="material-symbols-rounded text-primary text-3xl">terminal</span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface mb-2">
              Welcome to <span className="text-primary">StockY</span>
            </h1>
            <p className="text-on-surface-muted text-sm">
              {isLogin ? 'Enter your credentials to access the terminal' : 'Create an account to join the terminal'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-on-surface-muted uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#111316] border border-surface-border text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder-on-surface-muted/50"
                  placeholder="John Doe"
                  required={!isLogin}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-on-surface-muted uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#111316] border border-surface-border text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder-on-surface-muted/50"
                placeholder="trader@stocky.ai"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-muted uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#111316] border border-surface-border text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder-on-surface-muted/50"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-[#111316] font-bold py-3 rounded-lg transition-colors flex items-center justify-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(38,254,220,0.4)] hover:shadow-[0_0_25px_rgba(38,254,220,0.6)]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#111316] border-t-transparent rounded-full animate-spin" />
              ) : (
                isLogin ? 'Secure Login' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-surface-border pt-6">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-on-surface-muted hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md px-3 py-1"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
