

'use client';

import { useState } from 'react';
import { Download, RotateCcw, Loader2, Sparkles, Check } from 'lucide-react';
import { ThemeConfig } from '../types/theme';

interface ResultScreenProps {
  themeConfig: ThemeConfig;
  imageUrl: string; // Base64 data URL from local canvas
  name: string;
  role: string;
  title: string;
  onReset: () => void;
}

export function ResultScreen({
  themeConfig,
  imageUrl,
  name,
  role,
  title,
  onReset
}: ResultScreenProps) {
  const isGoa = themeConfig.id === 'goa';
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    try {
      const cleanName = (name || 'builder').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const filename = `hackerhouse-goa-2026-${cleanName}.png`;
      
      const link = document.createElement('a');
      link.download = filename;
      link.href = imageUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image. Try right-clicking the card to save it.');
    }
  };

  const handleShareToX = async () => {
    setIsSharing(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // 1. Upload to ephemeral / Cloudinary storage
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers,
        body: JSON.stringify({ image: imageUrl, name }),
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const uploadData = await res.json();
      
      if (uploadData.success && uploadData.url) {
        // 2. Base64 encode details to carry in the URL
        const payload = JSON.stringify({
          img: uploadData.url,
          name,
          role,
          title
        });
        const encodedPayload = Buffer.from(payload).toString('base64');
        const shareUrl = `${window.location.origin}/share/${encodeURIComponent(encodedPayload)}`;

        // 3. Trigger Twitter intent
        const tweetText = `Ready for HackerHouse Goa 2026! Forged as a ${title.toUpperCase()} 🚀\n\nCreate your builder card here:\n`;
        const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}&hashtags=FrameInGoa,HackerHouseGoa`;
        
        window.open(xUrl, '_blank', 'noopener,noreferrer');
      } else {
        throw new Error('Failed to generate sharing URL');
      }
    } catch (error) {
      console.error('Sharing failed:', error);
      alert('Failed to upload card for sharing. Try downloading and uploading directly to X.');
    } finally {
      setIsSharing(false);
    }
  };

  const copyShareLink = async () => {
    setCopied(true);
    try {
      setIsSharing(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers,
        body: JSON.stringify({ image: imageUrl, name }),
      });
      const uploadData = await res.json();

      
      if (uploadData.success && uploadData.url) {
        const payload = JSON.stringify({
          img: uploadData.url,
          name,
          role,
          title
        });
        const encodedPayload = Buffer.from(payload).toString('base64');
        const shareUrl = `${window.location.origin}/share/${encodeURIComponent(encodedPayload)}`;
        
        await navigator.clipboard.writeText(shareUrl);
        setTimeout(() => setCopied(false), 2000);
      } else {
        throw new Error();
      }
    } catch {
      alert('Failed to copy link');
      setCopied(false);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 select-none animate-fade-in relative z-20">
      
      {/* Dynamic Themed Card Heading */}
      <div className="text-center mb-6">
        <span 
          className={`
            px-3 py-1 rounded-md text-xs font-black uppercase border tracking-wider
            ${isGoa ? 'bg-[#FFE566] border-[#083C26] text-[#083C26]' : 'bg-[#B22222] border-[#B22222] text-[#F2EFE9]'}
          `}
        >
          CARD GENERATED!
        </span>
        <h2 
          className={`
            text-2xl md:text-3xl font-black mt-2 uppercase
            ${isGoa ? 'text-[#083C26] font-serif' : 'text-[#F2EFE9] font-cinzel tracking-widest'}
          `}
        >
          {isGoa ? 'YOUR VIBE IS SECURED' : 'YOUR IDENTITY IS FORGED'}
        </h2>
      </div>

      {/* Render Final Card Image Preview */}
      <div className="relative w-full aspect-[4/5] border-4 border-[#083C26] rounded-2xl overflow-hidden shadow-xl mb-8 max-w-sm mx-auto
        data-[theme=aot]:border-[#F2EFE9] data-[theme=aot]:rounded-sm
      "
      data-theme={themeConfig.id}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={imageUrl} 
          alt="Generated HackerHouse Card" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Buttons Block */}
      <div className="space-y-4 max-w-sm mx-auto">
        {/* DOWNLOAD BUTTON */}
        <button
          onClick={handleDownload}
          className={`
            w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-md border-2
            ${isGoa 
              ? 'bg-[#FFE566] text-[#083C26] border-[#083C26] hover:bg-[#FF2E93] hover:text-white shadow-[4px_4px_0px_0px_#083C26]' 
              : 'bg-[#F2EFE9] text-[#0A0E12] border-[#F2EFE9] hover:bg-[#FFE566] hover:border-[#083C26]'}
          `}
        >
          <Download className="w-5 h-5" />
          <span className="uppercase tracking-wider text-sm md:text-base">DOWNLOAD PNG</span>
        </button>

        {/* SHARE TO X BUTTON */}
        <button
          onClick={handleShareToX}
          disabled={isSharing}
          className={`
            w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-md border-2 disabled:opacity-50 disabled:cursor-not-allowed
            ${isGoa 
              ? 'bg-[#083C26] text-[#FFE566] border-[#083C26] hover:bg-[#FFE566] hover:text-[#083C26]' 
              : 'bg-[#B22222] text-[#F2EFE9] border-[#B22222] hover:bg-[#E05A1F] hover:border-[#E05A1F] shadow-[0px_4px_15px_rgba(178,34,34,0.3)]'}
          `}
        >
          {isSharing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          )}
          <span className="uppercase tracking-wider text-sm md:text-base">
            {isSharing ? 'UPLOADING...' : 'SHARE TO X'}
          </span>
        </button>

        {/* COPY LINK / CREATE ANOTHER */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={copyShareLink}
            disabled={isSharing}
            className={`
              py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border text-xs uppercase tracking-wide cursor-pointer transition-all transform active:scale-95 disabled:opacity-50
              ${isGoa
                ? 'bg-white text-[#083C26] border-[#083C26] hover:bg-[#EAE5DB]'
                : 'bg-[#182029] text-[#F2EFE9] border-white/10 hover:bg-[#202B37]'}
            `}
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Sparkles className="w-4 h-4" />}
            <span>{copied ? 'COPIED!' : 'COPY SHARE LINK'}</span>
          </button>

          <button
            onClick={onReset}
            className={`
              py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border text-xs uppercase tracking-wide cursor-pointer transition-all transform active:scale-95
              ${isGoa
                ? 'bg-transparent text-[#083C26] border-[#083C26] hover:bg-[#FFE566]/20'
                : 'bg-transparent text-[#8B959A] border-white/10 hover:text-[#F2EFE9] hover:bg-white/5'}
            `}
          >
            <RotateCcw className="w-4 h-4" />
            <span>CREATE ANOTHER</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default ResultScreen;
