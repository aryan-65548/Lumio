'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ThemeType } from '../types/theme';



interface BackgroundProps {
  theme: ThemeType;
}

export function ThemeBackground({ theme }: BackgroundProps) {
  const isGoa = theme === 'goa';

  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden pointer-events-none select-none">
      <AnimatePresence mode="wait">
        {isGoa ? (
          /* GOA BEACH BACKGROUND */
          <motion.div
            key="goa-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full noise-bg bg-gradient-to-br from-[#FFFDF6] via-[#FFF2FA] to-[#EBF7FF]"
          >
            {/* Inject CSS styling for GPU-accelerated wave & shimmer animations */}
            <style dangerouslySetInnerHTML={{ __html: `
              @media (prefers-reduced-motion: reduce) {
                .parallax > use {
                  animation: none !important;
                }
                .shimmer-orb {
                  animation: none !important;
                }
              }
              .parallax > use {
                animation: move-forever 35s cubic-bezier(.55,.5,.45,.5) infinite;
              }
              .parallax > use:nth-child(1) {
                animation-delay: -2s;
                animation-duration: 14s;
              }
              .parallax > use:nth-child(2) {
                animation-delay: -3s;
                animation-duration: 22s;
              }
              .parallax > use:nth-child(3) {
                animation-delay: -4s;
                animation-duration: 30s;
              }
              .parallax > use:nth-child(4) {
                animation-delay: -5s;
                animation-duration: 45s;
              }
              @keyframes move-forever {
                0% {
                  transform: translate3d(-90px,0,0);
                }
                100% { 
                  transform: translate3d(85px,0,0);
                }
              }
              @keyframes shimmer-drift {
                0% {
                  transform: translate3d(0, 0, 0) scale(0.85);
                  opacity: 0.05;
                }
                50% {
                  opacity: 0.25;
                }
                100% {
                  transform: translate3d(30px, -45px, 0) scale(1.15);
                  opacity: 0.08;
                }
              }
            `}} />

            {/* Soft Sun Ray overlay */}
            <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-radial from-[#FFE566]/20 via-[#FF9E47]/5 to-transparent blur-3xl" />
            
            {/* Big Sun */}
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[70vw] max-w-[500px] aspect-square rounded-full bg-gradient-to-b from-[#FFE566] via-[#FF9E47]/70 to-[#FF2E93]/0 opacity-30 blur-sm" />

            {/* Sunlight Shimmer floating spots */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
              {Array.from({ length: 8 }).map((_, i) => {
                const size = ((i * 37) % 150) + 80;
                const left = (i * 23) % 100;
                const top = (i * 17) % 80;
                const delay = (i * 1.3) % 8;
                const duration = ((i * 2.7) % 15) + 10;
                
                return (
                  <div
                    key={i}
                    className="absolute rounded-full bg-gradient-to-tr from-[#FFE566]/5 to-[#FF2E93]/2 opacity-20 pointer-events-none mix-blend-color-burn shimmer-orb"
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      width: `${size}px`,
                      height: `${size}px`,
                      filter: 'blur(40px)',
                      animation: `shimmer-drift ${duration}s ease-in-out ${delay}s infinite alternate`
                    }}
                  />
                );
              })}
            </div>

            {/* Layered, slow-moving SVG wave shapes across the lower half */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none h-[30vh] sm:h-[40vh] md:h-[50vh]">
              <svg 
                className="waves w-full h-full" 
                xmlns="http://www.w3.org/2000/svg" 
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 24 150 28" 
                preserveAspectRatio="none" 
                shapeRendering="auto"
              >
                <defs>
                  <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z" />
                </defs>
                <g className="parallax">
                  <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(0, 163, 224, 0.05)" />
                  <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255, 46, 147, 0.03)" />
                  <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(8, 60, 38, 0.05)" />
                  <use xlinkHref="#gentle-wave" x="48" y="7" fill="rgba(255, 253, 246, 0.15)" />
                </g>
              </svg>
            </div>



            {/* Beach Scribbles (drawn using simple styled divs to mimic pencil sketches) */}
            <div className="absolute top-1/4 left-10 w-24 h-24 border-2 border-dashed border-[#FF2E93]/10 rounded-full rotate-12 hidden md:block" />
            <div className="absolute bottom-1/3 right-12 w-32 h-12 border-b-4 border-dashed border-[#00A3E0]/15 skew-x-12 hidden md:block" />
          </motion.div>
        ) : (
          /* AOT THEME BACKGROUND */
          <motion.div
            key="aot-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full noise-bg bg-gradient-to-b from-[#090D12] via-[#0D141C] to-[#1A1410]"
          >

            {/* Red smoke glowing center */}
            <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[90vw] h-[60vh] rounded-full bg-[#B22222]/10 blur-3xl pointer-events-none" />

            {/* Glowing fire sparks/embers */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              {Array.from({ length: 22 }).map((_, i) => {
                const size = ((i * 7) % 8) + 3;
                const left = (i * 13) % 100;
                const delay = (i * 0.7) % 5;
                const duration = ((i * 1.3) % 4) + 3;
                
                return (
                  <div
                    key={i}
                    className="absolute bottom-[-10px] rounded-full bg-gradient-to-t from-[#FFE566] to-[#E05A1F] opacity-75 pointer-events-none ember"
                    style={{
                      left: `${left}%`,
                      width: `${size}px`,
                      height: `${size}px`,
                      animationDelay: `${delay}s`,
                      animationDuration: `${duration}s`,
                      boxShadow: '0 0 10px #E05A1F, 0 0 20px #B22222',
                    }}
                  />
                );
              })}
            </div>

            {/* Wall Silhouettes at the sides */}
            <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-black/40 to-transparent border-r border-[#F2EFE9]/5 hidden lg:block" />
            <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-black/40 to-transparent border-l border-[#F2EFE9]/5 hidden lg:block" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThemeBackground;
