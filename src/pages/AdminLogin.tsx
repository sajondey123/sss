import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdminAuthenticated');
    if (isAdmin === 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple password check as requested
    // In a real production app, this should be handled server-side or via Firebase Auth
    if (password === 'admin2026') {
      localStorage.setItem('isAdminAuthenticated', 'true');
      navigate('/admin');
    } else {
      setError('Incorrect password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
      >
        <div className="bg-indigo-900 p-8 text-center text-white">
          <Shield className="h-16 w-16 text-orange-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold uppercase tracking-wider">Admin Portal</h1>
          <p className="opacity-70 text-sm mt-2">Secured Access for Ganesh Puja Council</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Lock className="h-4 w-4" /> Admin Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-medium text-center">{error}</p>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Login to Dashboard'}
          </button>

          <div className="pt-4 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
              Authorized Personnel Only
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
