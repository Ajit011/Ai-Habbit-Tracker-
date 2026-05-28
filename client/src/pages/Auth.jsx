import React, { useState } from 'react';
import { Mail, Lock, User, Sparkles, LogIn, UserPlus } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      // Save Token and User Data to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify({ name: data.name, email: data.email }));
      
      alert(`${isLogin ? 'Login' : 'Registration'} Successful! Welcome ${data.name}`);
      // Redirect logic will go here in the next step!
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center p-4 text-slate-100 font-sans">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-amber-500/30">
        
        {/* Glow Element */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 rounded-xl mb-3 border border-amber-500/20">
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isLogin ? 'Track consistency, power up with AI' : 'Start your 90-day transformation journey'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  placeholder="John Doe"
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-amber-500 transition-all text-slate-200"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="you@example.com"
                className="w-full bg-slate-950/40 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-amber-500 transition-all text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="••••••••"
                className="w-full bg-slate-950/40 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-amber-500 transition-all text-slate-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? (
              <> <LogIn className="w-4 h-4" /> Sign In </>
            ) : (
              <> <UserPlus className="w-4 h-4" /> Sign Up </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="text-center mt-6 pt-6 border-t border-slate-800/60 text-sm">
          <p className="text-slate-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-amber-400 font-medium hover:underline focus:outline-none ml-1"
            >
              {isLogin ? 'Create one' : 'Sign in instead'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Auth;