'use client';

import { ThemeConfig } from '../types/theme';
import { BuilderDetails } from '../types/builder';

interface CardPreviewProps {
  themeConfig: ThemeConfig;
  details: BuilderDetails;
  photoSrc: string | null;
  previewDataUrl?: string | null;
  isPreviewLoading?: boolean;
}

export function CardPreview({ 
  themeConfig, 
  details, 
  photoSrc, 
  previewDataUrl, 
  isPreviewLoading 
}: CardPreviewProps) {
  const isGoa = themeConfig.id === 'goa';

  return (
    <div className="w-full max-w-sm mx-auto select-none">
      <div 
        className={`
          w-full aspect-[4/5] relative overflow-hidden rounded-2xl transition-all duration-350 shadow-2xl border-4 flex items-center justify-center
          ${isGoa ? 'bg-[#E8D8B6] border-[#083C26]' : 'bg-[#090D12] border-white/10'}
        `}
      >
        {previewDataUrl ? (
          <div className="w-full h-full relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={previewDataUrl} 
              alt="Live card preview" 
              className={`w-full h-full object-contain pointer-events-none transition-opacity duration-200 ${isPreviewLoading ? 'opacity-70' : 'opacity-100'}`}
            />
            {isPreviewLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/5 pointer-events-none">
                <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${isGoa ? 'border-[#083C26]' : 'border-[#E05A1F]'}`} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className={`w-8 h-8 border-2 rounded-full animate-spin border-t-transparent ${isGoa ? 'border-[#083C26]' : 'border-[#F2EFE9]'}`} />
            <span className={`text-[10px] font-bold tracking-wider mt-3 uppercase ${isGoa ? 'text-[#083C26]/60' : 'text-[#F2EFE9]/40'}`}>
              PREPARING PREVIEW...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardPreview;
