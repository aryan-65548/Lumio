'use client';

import { useRef } from 'react';
import { Upload, FileImage, AlertTriangle } from 'lucide-react';
import { ThemeConfig } from '../types/theme';

interface PhotoUploaderProps {
  themeConfig: ThemeConfig;
  isDragActive: boolean;
  error: string | null;
  isLoading: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PhotoUploader({
  themeConfig,
  isDragActive,
  error,
  isLoading,
  onDrag,
  onDrop,
  onFileChange
}: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isGoa = themeConfig.id === 'goa';

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div id="photo-uploader-container" className="w-full max-w-lg mx-auto px-4 select-none">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
        onChange={onFileChange}
        className="hidden"
        id="file-upload"
      />

      <div
        onDragEnter={onDrag}
        onDragOver={onDrag}
        onDragLeave={onDrag}
        onDrop={onDrop}
        onClick={triggerFileSelect}
        className={`
          w-full aspect-[4/3] rounded-2xl border-4 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group
          ${isGoa 
            ? isDragActive
              ? 'bg-[#FFE566]/20 border-[#FF2E93] scale-[1.02]' 
              : 'bg-[#FFFDF9]/85 backdrop-blur-[6px] border-[#083C26] hover:bg-[#FFE566]/10 hover:border-[#FF2E93]'
            : isDragActive
              ? 'bg-[#E05A1F]/10 border-[#E05A1F] scale-[1.02]' 
              : 'bg-[#131921]/70 border-white/20 hover:bg-[#1A232E]/70 hover:border-[#E05A1F]'}
        `}
        role="button"
        tabIndex={0}
        aria-label="Upload Photo drag zone"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            triggerFileSelect();
          }
        }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3">
            {/* Themed Loader inside Drag Box */}
            <div 
              className={`
                w-12 h-12 rounded-full border-4 border-t-transparent animate-spin
                ${isGoa ? 'border-[#083C26]' : 'border-[#F2EFE9]'}
              `}
            />
            <p className={`font-bold text-sm ${isGoa ? 'text-[#083C26]' : 'text-[#F2EFE9]'}`}>
              PROCESSING IMAGE...
            </p>
          </div>
        ) : (
          <>
            <div 
              className={`
                p-4 rounded-full mb-4 transition-all duration-300 group-hover:scale-110
                ${isGoa ? 'bg-[#FFE566] text-[#083C26] border-2 border-[#083C26]' : 'bg-[#1D2633] text-[#F2EFE9] border border-white/10'}
              `}
            >
              <Upload className="w-8 h-8" />
            </div>

            <h3 
              className={`
                font-bold text-lg md:text-xl mb-1
                ${isGoa ? 'text-[#083C26]' : 'text-[#F2EFE9]'}
              `}
            >
              CLICK TO UPLOAD
            </h3>
            <p className={`text-xs md:text-sm font-semibold mb-4 ${isGoa ? 'text-[#3D6852]' : 'text-[#8B959A]'}`}>
              or drag and drop your photo here
            </p>

            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider opacity-60">
              <FileImage className="w-3.5 h-3.5" />
              <span>JPG, PNG, WEBP, HEIC (MAX. 10MB)</span>
            </div>
          </>
        )}

        {/* Drag Active Glow overlay */}
        {isDragActive && (
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center backdrop-blur-[2px]">
            <span className={`text-base font-black uppercase ${isGoa ? 'text-[#FF2E93]' : 'text-[#E05A1F]'}`}>
              DROP IT HERE!
            </span>
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div 
          className={`
            mt-4 p-3.5 rounded-xl border-2 flex items-start gap-2.5 animate-pulse
            ${isGoa 
              ? 'bg-[#FF2E93]/10 border-[#FF2E93] text-[#FF2E93]' 
              : 'bg-[#B22222]/10 border-[#B22222] text-[#F2EFE9]'}
          `}
          role="alert"
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-xs font-bold uppercase tracking-wide">{error}</span>
        </div>
      )}
    </div>
  );
}
export default PhotoUploader;
