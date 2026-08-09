'use client';

import { LogOut, User as UserIcon } from 'lucide-react';
import { ThemeConfig } from '../types/theme';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  themeConfig: ThemeConfig;
}

export function HackerHouseHeader({ themeConfig }: HeaderProps) {
  const isGoa = themeConfig.id === 'goa';
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full py-8 px-4 md:px-8 flex flex-col items-center justify-center relative z-20 select-none">
      {/* Authenticated User Bar */}
      {isAuthenticated && user && (
        <div className="w-full max-w-6xl flex justify-between items-center mb-6 px-2">
          <div
            className={`
              flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider border shadow-sm
              ${isGoa
                ? 'bg-white/90 text-[#083C26] border-[#083C26]'
                : 'bg-[#182029] text-[#F2EFE9] border-white/10'}
            `}
          >
            <UserIcon className="w-3.5 h-3.5 text-[#00A3E0]" />
            <span>{user.fullName}</span>
          </div>

          <button
            onClick={logout}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all cursor-pointer shadow-sm
              ${isGoa
                ? 'bg-white/80 text-[#083C26] border-[#083C26] hover:bg-[#FFE566]'
                : 'bg-[#182029] text-[#8B959A] border-white/10 hover:text-white hover:bg-white/10'}
            `}
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOG OUT</span>
          </button>
        </div>
      )}

      <div className="text-center">
        <div className="relative inline-block">
          {/* Main title: extremely large, bold geometric display sans-serif */}
          <h1 
            className={`
              font-sans font-black text-4xl sm:text-5xl md:text-7xl uppercase tracking-tighter leading-none select-none
              ${isGoa ? 'text-[#083C26]' : 'text-[#F2EFE9]'}
            `}
            style={!isGoa ? { textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000' } : undefined}
          >
            HACKER HOUSE
          </h1>

          {/* Overlapping pink "गोवा" text integrated on the right side of the word HOUSE */}
          <span 
            className="absolute -right-8 -top-3 sm:-right-12 sm:-top-5 md:-right-14 md:-top-6 font-handwriting text-3xl sm:text-4xl md:text-6xl text-[#FF2E93] rotate-[15deg] select-none z-10"
            style={!isGoa ? { WebkitTextStroke: '1px #000', textShadow: '1px 1px 0 #000, -1px -1px 0 #000' } : undefined}
          >
            गोवा
          </span>
        </div>

        {/* Subtitle centered directly underneath */}
        <div 
          className={`
            font-sans font-black text-sm sm:text-base md:text-lg uppercase tracking-[0.25em] mt-3
            ${isGoa ? 'text-[#00A3E0]' : 'text-[#E05A1F]'}
          `}
          style={!isGoa ? { textShadow: '1px 1px 0 #000, -1px -1px 0 #000' } : undefined}
        >
          GOA 2026
        </div>
      </div>
    </header>
  );
}

export default HackerHouseHeader;

