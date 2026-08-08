'use client';

import { motion } from 'framer-motion';
import { ThemeConfig } from '../types/theme';

interface GenerationStateProps {
  themeConfig: ThemeConfig;
}

export function GenerationState({ themeConfig }: GenerationStateProps) {
  const isGoa = themeConfig.id === 'goa';

  return (
    <div className="fixed inset-0 w-full h-full bg-black/45 backdrop-blur-md flex flex-col items-center justify-center z-50 select-none">
      <div 
        className={`
          max-w-md w-full p-8 mx-4 rounded-2xl border-4 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-2xl
          ${isGoa 
            ? 'bg-[#FFFDF9] border-[#083C26] text-[#083C26] shadow-[8px_8px_0px_0px_#083C26]' 
            : 'bg-[#131921] border-[#B22222] text-[#F2EFE9]'}
        `}
      >
        {/* Procedural Theme-Specific Loader Graphic */}
        {isGoa ? (
          /* GOA WAVE LOADER */
          <div className="flex items-center gap-2 mb-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -18, 0],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
                className={`
                  w-5 h-5 rounded-full border-2 border-[#083C26]
                  ${i === 0 ? 'bg-[#FF2E93]' : i === 1 ? 'bg-[#FFE566]' : 'bg-[#00A3E0]'}
                `}
              />
            ))}
          </div>
        ) : (
          /* AOT BURNING EMBER LOADER */
          <div className="relative w-16 h-16 mb-6">
            <motion.div
              animate={{
                rotate: 360,
                borderColor: ['#B22222', '#E05A1F', '#B22222'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute inset-0 border-4 border-dashed rounded-full"
            />
            <div className="absolute inset-2 bg-gradient-to-br from-[#E05A1F] to-[#B22222] rounded-full animate-pulse shadow-[0_0_15px_#E05A1F]" />
          </div>
        )}

        {/* Framing text */}
        <h2 
          className={`
            font-black text-2xl tracking-widest uppercase mb-2.5
            ${isGoa ? 'font-serif' : 'font-cinzel text-[#E05A1F]'}
          `}
        >
          FRAMING YOUR VIBE...
        </h2>
        <p className={`text-xs font-semibold ${isGoa ? 'text-[#3D6852]' : 'text-[#8B959A]'} uppercase tracking-wider`}>
          {isGoa ? 'Catching the tropical rays' : 'Forging details onto the wall'}
        </p>
      </div>
    </div>
  );
}
export default GenerationState;
