/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { MobileApp } from './mobile/MobileApp';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { cn } from './lib/utils';

function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [isSent, setIsSent] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[2rem] shadow-xl w-full max-w-md border border-slate-100"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <Mail className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        
        {!isSent ? (
          <>
            <h2 className="text-3xl font-black text-center text-slate-900 mb-2">Reset Password</h2>
            <p className="text-slate-500 text-center mb-10">Enter your email to receive a reset link</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50/50"
                  placeholder="name@demo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Check Email</h2>
            <p className="text-slate-500 mb-10 leading-relaxed">
              We've sent a password reset link to <span className="font-bold text-slate-900">{email}</span>.
            </p>
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-sm font-bold mb-8">
              Link expires in 30 minutes
            </div>
          </div>
        )}
        
        <button 
          onClick={() => navigate(-1)}
          className="w-full mt-6 text-slate-400 text-sm font-semibold hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>
      </motion.div>
    </div>
  );
}

function LoginScreen() {
  const navigate = useNavigate();
  const { staff, setCurrentUser } = useApp();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      const user = staff.find(s => s.email === email) || staff[0];
      setCurrentUser(user);
      navigate('/staff/tasks');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[2rem] shadow-xl w-full max-w-md border border-slate-100"
      >
        <div className="flex justify-center mb-8">
          <img 
            src="https://deftsoft.com/wp-content/uploads/2025/08/deft-logo2.svg" 
            alt="Deftsoft Logo" 
            className="h-12 w-auto"
            referrerPolicy="no-referrer"
          />
        </div>
        <h2 className="text-3xl font-black text-center text-slate-900 mb-2">
          Staff Login
        </h2>
        <p className="text-slate-500 text-center mb-10">Enter your credentials to continue</p>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50/50"
              placeholder="name@demo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50/50"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2",
              "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100",
              isLoading && "opacity-70 cursor-not-allowed"
            )}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/forgot-password')}
            className="text-slate-400 text-sm font-semibold hover:text-indigo-600 transition-colors"
          >
            Forgot Password?
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/staff-login" replace />} />
            <Route path="/staff-login" element={<LoginScreen />} />
            <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
            <Route path="/staff/*" element={<MobileApp />} />
            <Route path="*" element={<Navigate to="/staff-login" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}
