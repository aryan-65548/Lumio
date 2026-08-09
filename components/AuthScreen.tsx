'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, User as UserIcon, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { ThemeConfig } from '../types/theme';
import { useAuth } from '../context/AuthContext';

interface AuthScreenProps {
  themeConfig: ThemeConfig;
}

export function AuthScreen({ themeConfig }: AuthScreenProps) {
  const isGoa = themeConfig.id === 'goa';
  const { login, register, error, clearError, isLoading } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleToggleMode = (newMode: 'login' | 'register') => {
    clearError();
    setMode(newMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      await login(email, password);
    } else {
      await register(fullName, email, password);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 select-none relative z-20 animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`
          p-6 md:p-8 rounded-2xl transition-all duration-350 shadow-xl border-2
          ${isGoa ? 'glass-panel-goa border-[#083C26]' : 'glass-panel-aot border-white/10'}
        `}
      >
        {/* Top Header Badge */}
        <div className="text-center mb-6">
          <span
            className={`
              px-3 py-1 rounded-md text-xs font-black uppercase border tracking-wider inline-flex items-center gap-1.5
              ${isGoa ? 'bg-[#FFE566] border-[#083C26] text-[#083C26]' : 'bg-[#B22222] border-[#B22222] text-[#F2EFE9]'}
            `}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>BUILDER ACCESS</span>
          </span>
          
          <h2
            className={`
              text-2xl md:text-3xl font-black mt-3 uppercase tracking-tight
              ${isGoa ? 'text-[#083C26] font-serif' : 'text-[#F2EFE9] font-cinzel'}
            `}
          >
            {mode === 'login' ? 'WELCOME BACK' : 'JOIN HACKERHOUSE'}
          </h2>
          <p
            className={`
              text-xs mt-1 font-semibold uppercase tracking-wider
              ${isGoa ? 'text-[#00A3E0]' : 'text-[#E05A1F]'}
            `}
          >
            {mode === 'login' ? 'LOG IN TO ACCESS BUILDER CARD GENERATOR' : 'CREATE AN ACCOUNT TO FORGE YOUR CARD'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          className={`
            grid grid-cols-2 p-1 rounded-xl mb-6 border text-xs font-bold uppercase tracking-wider
            ${isGoa ? 'bg-black/5 border-[#083C26]/20' : 'bg-black/40 border-white/10'}
          `}
        >
          <button
            type="button"
            onClick={() => handleToggleMode('login')}
            className={`
              py-2.5 rounded-lg transition-all cursor-pointer text-center
              ${mode === 'login'
                ? isGoa
                  ? 'bg-[#083C26] text-[#FFE566] shadow-sm'
                  : 'bg-[#B22222] text-[#F2EFE9] shadow-sm'
                : isGoa
                  ? 'text-[#083C26]/70 hover:text-[#083C26]'
                  : 'text-[#8B959A] hover:text-white'}
            `}
          >
            LOG IN
          </button>
          <button
            type="button"
            onClick={() => handleToggleMode('register')}
            className={`
              py-2.5 rounded-lg transition-all cursor-pointer text-center
              ${mode === 'register'
                ? isGoa
                  ? 'bg-[#083C26] text-[#FFE566] shadow-sm'
                  : 'bg-[#B22222] text-[#F2EFE9] shadow-sm'
                : isGoa
                  ? 'text-[#083C26]/70 hover:text-[#083C26]'
                  : 'text-[#8B959A] hover:text-white'}
            `}
          >
            REGISTER
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label
                className={`
                  block text-xs font-bold uppercase tracking-wider mb-1.5
                  ${isGoa ? 'text-[#083C26]' : 'text-[#F2EFE9]'}
                `}
              >
                FULL NAME
              </label>
              <div className="relative">
                <UserIcon
                  className={`
                    w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2
                    ${isGoa ? 'text-[#083C26]/60' : 'text-white/40'}
                  `}
                />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Satoshi Nakamoto"
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold transition-all outline-none border-2
                    ${isGoa
                      ? 'bg-white/80 text-[#083C26] border-[#083C26] focus:bg-white placeholder:text-[#083C26]/40'
                      : 'bg-[#182029] text-[#F2EFE9] border-white/10 focus:border-[#E05A1F] placeholder:text-[#8B959A]'}
                  `}
                />
              </div>
            </div>
          )}

          <div>
            <label
              className={`
                block text-xs font-bold uppercase tracking-wider mb-1.5
                ${isGoa ? 'text-[#083C26]' : 'text-[#F2EFE9]'}
              `}
            >
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail
                className={`
                  w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2
                  ${isGoa ? 'text-[#083C26]/60' : 'text-white/40'}
                `}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="builder@hackerhouse.dev"
                className={`
                  w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold transition-all outline-none border-2
                  ${isGoa
                    ? 'bg-white/80 text-[#083C26] border-[#083C26] focus:bg-white placeholder:text-[#083C26]/40'
                    : 'bg-[#182029] text-[#F2EFE9] border-white/10 focus:border-[#E05A1F] placeholder:text-[#8B959A]'}
                `}
              />
            </div>
          </div>

          <div>
            <label
              className={`
                block text-xs font-bold uppercase tracking-wider mb-1.5
                ${isGoa ? 'text-[#083C26]' : 'text-[#F2EFE9]'}
              `}
            >
              PASSWORD
            </label>
            <div className="relative">
              <Lock
                className={`
                  w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2
                  ${isGoa ? 'text-[#083C26]/60' : 'text-white/40'}
                `}
              />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`
                  w-full pl-10 pr-4 py-3 rounded-xl text-sm font-semibold transition-all outline-none border-2
                  ${isGoa
                    ? 'bg-white/80 text-[#083C26] border-[#083C26] focus:bg-white placeholder:text-[#083C26]/40'
                    : 'bg-[#182029] text-[#F2EFE9] border-white/10 focus:border-[#E05A1F] placeholder:text-[#8B959A]'}
                `}
              />
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
              <p className="text-xs font-bold uppercase text-red-500 tracking-wide">
                {error}
              </p>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full py-4 px-6 rounded-2xl font-black text-sm md:text-base flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-6
              ${isGoa
                ? 'bg-[#083C26] text-[#FFE566] border-[#083C26] hover:bg-[#FFE566] hover:text-[#083C26] shadow-[4px_4px_0px_0px_#083C26]'
                : 'bg-[#B22222] text-[#F2EFE9] border-[#B22222] hover:bg-[#E05A1F] hover:border-[#E05A1F]'}
            `}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span className="uppercase tracking-wider">
                  {mode === 'login' ? 'ENTER GENERATOR' : 'CREATE ACCOUNT'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default AuthScreen;
