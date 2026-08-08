'use client';

import { motion } from 'framer-motion';
import { ThemeType } from '../types/theme';

interface ThemeSwitcherProps {
  currentTheme: ThemeType;
  onChange: (theme: ThemeType) => void;
}

export function ThemeSwitcher({ currentTheme, onChange }: ThemeSwitcherProps) {
  const isGoa = currentTheme === 'goa';

  return (
    <div className="flex justify-center w-full px-4 mb-8 relative z-10 select-none">
      <div 
        className={`
          flex p-1.5 rounded-full relative max-w-sm w-full transition-all duration-350 border-2
          ${isGoa 
            ? 'bg-[#EAE5DB] border-[#083C26] shadow-[4px_4px_0px_0px_#083C26]' 
            : 'bg-[#131921] border-[#F2EFE9] shadow-[0px_4px_20px_rgba(0,0,0,0.5)]'}
        `}
        role="tablist"
        aria-label="Select theme"
      >
        {/* GOA BEACH Tab */}
        <button
          onClick={() => onChange('goa')}
          role="tab"
          aria-selected={isGoa}
          className={`
            flex-1 py-2.5 rounded-full font-bold text-sm md:text-base flex items-center justify-center gap-2 relative z-20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            ${isGoa ? 'text-[#083C26] focus-visible:ring-[#083C26]' : 'text-[#8B959A] hover:text-[#F2EFE9] focus-visible:ring-[#F2EFE9]'}
          `}
        >
          {isGoa && (
            <motion.div
              layoutId="activeThemeBg"
              className="absolute inset-0 bg-[#FFE566] border-2 border-[#083C26] rounded-full z-[-1]"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <span>🌴 GOA BEACH</span>
        </button>

        {/* AOT Tab */}
        <button
          onClick={() => onChange('aot')}
          role="tab"
          aria-selected={!isGoa}
          className={`
            flex-1 py-2.5 rounded-full font-bold text-sm md:text-base flex items-center justify-center gap-2 relative z-20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            ${!isGoa ? 'text-[#090D12] focus-visible:ring-[#F2EFE9]' : 'text-[#3D6852] hover:text-[#083C26] focus-visible:ring-[#083C26]'}
          `}
        >
          {!isGoa && (
            <motion.div
              layoutId="activeThemeBg"
              className="absolute inset-0 bg-[#F2EFE9] border-2 border-[#B22222] rounded-full z-[-1]"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <span>⚔ AOT</span>
        </button>
      </div>
    </div>
  );
}
export default ThemeSwitcher;
