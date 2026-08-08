'use client';

import { RotateCw } from 'lucide-react';
import { ThemeConfig } from '../types/theme';

interface BuilderTitleProps {
  themeConfig: ThemeConfig;
  title: string;
  onRegenerate: () => void;
}

export function BuilderTitle({ themeConfig, title, onRegenerate }: BuilderTitleProps) {
  const isGoa = themeConfig.id === 'goa';

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 select-none w-full
      bg-[#FFFDF9] border-[#083C26] shadow-[4px_4px_0px_0px_#083C26]
      data-[theme=aot]:bg-[#131921] data-[theme=aot]:border-white/10 data-[theme=aot]:shadow-none
    "
    data-theme={themeConfig.id}
    >
      <span className={`text-[10px] font-black uppercase tracking-wider mb-1.5 ${isGoa ? 'text-[#3D6852]' : 'text-[#8B959A]'}`}>
        GENERATED BUILDER TITLE
      </span>
      
      <div className="flex items-center gap-3.5 mt-0.5">
        <span 
          className={`
            px-4 py-1.5 rounded-lg border-2 font-black text-sm uppercase tracking-wide
            ${isGoa 
              ? 'bg-[#FFE566] border-[#083C26] text-[#083C26]' 
              : 'bg-[#B22222] border-[#B22222] text-[#F2EFE9]'}
          `}
        >
          {title || 'CODE NINJA'}
        </span>

        <button
          onClick={onRegenerate}
          className={`
            p-2.5 rounded-xl border-2 transition-all cursor-pointer transform hover:scale-105 active:scale-95 flex items-center justify-center
            ${isGoa
              ? 'bg-[#083C26] text-[#FFE566] border-[#083C26] hover:bg-[#FF2E93] hover:text-white'
              : 'bg-[#1D2633] text-[#F2EFE9] border-white/10 hover:bg-[#E05A1F] hover:border-[#E05A1F]'}
          `}
          title="Regenerate Title"
          aria-label="Regenerate Title"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
export default BuilderTitle;
