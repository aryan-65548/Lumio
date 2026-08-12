'use client';

import { ThemeConfig } from '../types/theme';

interface HeaderProps {
  themeConfig: ThemeConfig;
}

export function HackerHouseHeader({ themeConfig }: HeaderProps) {
  const isGoa = themeConfig.id === 'goa';

  return (
    <header className="w-full py-8 px-4 md:px-8 flex flex-col items-center justify-center relative z-20 select-none">

      <div className="text-center">
        <div className="relative inline-block">
          {/* Main title: extremely large, bold geometric display sans-serif */}
          <h1
            className={`
              font-sans font-black text-4xl sm:text-5xl md:text-7xl uppercase tracking-tighter leading-none select-none
              ${isGoa ? 'text-[#083C26]' : 'text-[#F2EFE9]'}
            `}
            style={
              !isGoa
                ? {
                    textShadow:
                      '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                  }
                : undefined
            }
          >
            HACKER HOUSE
          </h1>

          {/* Overlapping pink "गोवा" text integrated on the right side of the word HOUSE */}
          <span
            className="absolute -right-8 -top-3 sm:-right-12 sm:-top-5 md:-right-14 md:-top-6 font-handwriting text-3xl sm:text-4xl md:text-6xl text-[#FF2E93] rotate-[15deg] select-none z-10"
            style={
              !isGoa
                ? {
                    WebkitTextStroke: '1px #000',
                    textShadow:
                      '1px 1px 0 #000, -1px -1px 0 #000',
                  }
                : undefined
            }
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
          style={
            !isGoa
              ? {
                  textShadow:
                    '1px 1px 0 #000, -1px -1px 0 #000',
                }
              : undefined
          }
        >
          GOA 2026
        </div>
      </div>
    </header>
  );
}

export default HackerHouseHeader;