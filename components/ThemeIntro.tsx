'use client';

import { ThemeConfig } from '../types/theme';

interface ThemeIntroProps {
  themeConfig: ThemeConfig;
}

export function ThemeIntro({ themeConfig }: ThemeIntroProps) {
  const isGoa = themeConfig.id === 'goa';

  return (
    <div className="text-center max-w-2xl mx-auto px-4 mb-8 select-none">
      <h2 
        className={`
          font-serif text-2xl md:text-4xl font-extrabold uppercase tracking-tight mb-3
          ${isGoa ? 'text-[#083C26] font-serif' : 'text-[#F2EFE9] font-cinzel tracking-widest'}
        `}
      >
        {isGoa ? 'CREATE YOUR PFP FRAME' : 'CHOOSE YOUR SIDE'}
      </h2>
      <p 
        className={`
          text-sm md:text-base font-medium max-w-md mx-auto leading-relaxed
          ${isGoa ? 'text-[#3D6852]' : 'text-[#8B959A]'}
        `}
      >
        {isGoa 
          ? 'Upload your photo, add your builder details, and bring your HackerHouse Goa vibe to life.'
          : 'Forge your HackerHouse Goa identity. Upload your profile, customize your survival metadata, and represent.'}
      </p>
    </div>
  );
}
export default ThemeIntro;
