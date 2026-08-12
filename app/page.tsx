'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Image as ImageIcon, X } from 'lucide-react';

import { useTheme } from '../hooks/useTheme';
import { usePhotoUpload } from '../hooks/usePhotoUpload';
import { getRandomTitle } from '../utils/titleGenerator';
import { renderCardToCanvas } from '../utils/canvasUtils';
import { BuilderDetails, ApplicationState } from '../types/builder';

// Components
import HackerHouseHeader from '../components/HackerHouseHeader';
import ThemeSwitcher from '../components/ThemeSwitcher';
import ThemeBackground from '../components/ThemeBackground';
import ThemeIntro from '../components/ThemeIntro';
import PhotoUploader from '../components/PhotoUploader';
import BuilderForm from '../components/BuilderForm';
import CardPreview from '../components/CardPreview';
import GenerationState from '../components/GenerationState';
import ResultScreen from '../components/ResultScreen';

function BuilderAppContent() {
  const { theme, themeConfig, setTheme, isGoa } = useTheme();

  const {
    photoSrc,
    isDragActive,
    error,
    isLoading: isPhotoLoading,
    handleDrag,
    handleDrop,
    handleFileChange,
    clearPhoto,
    setError
  } = usePhotoUpload();

  const [flowState, setFlowState] = useState<ApplicationState>('EMPTY');

  const [details, setDetails] = useState<BuilderDetails>({
    name: '',
    role: '',
    techStack: '',
    vibe: '',
    title: '',
  });

  const [generatedCardUrl, setGeneratedCardUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live Preview States
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reactive canvas rendering effect with 150ms debouncing to prevent lagging during typing
  useEffect(() => {
    if (flowState !== 'PHOTO_SELECTED') return;

    setIsPreviewLoading(true);

    const timer = setTimeout(async () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Make sure Google fonts are loaded before canvas rendering to prevent fallback drawing
        if (typeof document !== 'undefined' && document.fonts) {
          await document.fonts.ready;
        }

        await renderCardToCanvas(canvas, themeConfig, details, photoSrc);
        const dataUrl = canvas.toDataURL('image/png');
        setPreviewDataUrl(dataUrl);
      } catch (err) {
        console.error('Failed to render live preview canvas:', err);
      } finally {
        setIsPreviewLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [theme, themeConfig, details, photoSrc, flowState]);

  // Auto transition flow state based on photo state
  useEffect(() => {
    if (photoSrc && flowState === 'EMPTY') {
      setFlowState('PHOTO_SELECTED');

      // Set an initial title when photo is selected
      setDetails((prev) => ({
        ...prev,
        title: getRandomTitle(),
      }));
    }
  }, [photoSrc, flowState]);

  // Handle form text changes
  const handleValueChange = (field: keyof BuilderDetails, value: string) => {
    setDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Regenerate random title
  const handleRegenerateTitle = () => {
    setDetails((prev) => ({
      ...prev,
      title: getRandomTitle(prev.title),
    }));
  };

  // Generate card canvas action
  const handleGenerateCard = async () => {
    // Basic validation
    if (!details.name.trim()) {
      setError('Please fill in your Name before generating.');
      return;
    }

    if (!details.role.trim()) {
      setError('Please fill in your Role before generating.');
      return;
    }

    setFlowState('GENERATING');

    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas ref is missing');

      // Make sure Google fonts are loaded before canvas rendering to prevent fallback drawing
      if (typeof document !== 'undefined' && document.fonts) {
        await document.fonts.ready;
      }

      // Draw onto hidden canvas
      await renderCardToCanvas(canvas, themeConfig, details, photoSrc);

      // Convert canvas drawing to static image URL
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      setGeneratedCardUrl(dataUrl);

      // Add a slight intentional delay (1.5s) to allow theme loading animation to show
      setTimeout(() => {
        setFlowState('RESULT');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the card canvas.');
      setFlowState('PHOTO_SELECTED');
    }
  };

  // Reset/Start over helper
  const handleReset = () => {
    clearPhoto();

    setDetails({
      name: '',
      role: '',
      techStack: '',
      vibe: '',
      title: '',
    });

    setGeneratedCardUrl('');
    setFlowState('EMPTY');
  };

  // Transition back from edit form to upload screen
  const handleBackToUpload = () => {
    clearPhoto();
    setFlowState('EMPTY');
  };

  // Go back from result screen to edit screen
  const handleBackToEdit = () => {
    setFlowState('PHOTO_SELECTED');
  };

  return (
    <main className="flex-1 w-full min-h-screen flex flex-col relative transition-all duration-350 overflow-x-hidden">

      {/* 1. Theme-Specific Background Overlay */}
      <ThemeBackground theme={theme} />

      {/* 2. Brand Header */}
      <HackerHouseHeader themeConfig={themeConfig} />

      {/* Hidden high-res rendering canvas */}
      <canvas
        ref={canvasRef}
        width={1080}
        height={1350}
        className="hidden"
      />

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 pb-16 flex flex-col justify-center">

        {/* Builder Card Generator Flow */}
        <AnimatePresence mode="wait">

          {/* FLOW STATE: EMPTY (Upload & Start screen) */}
          {flowState === 'EMPTY' && (
            <motion.div
              key="state-empty"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center w-full"
            >

              {/* Theme selector */}
              <ThemeSwitcher currentTheme={theme} onChange={setTheme} />

              {/* Header Titles */}
              <ThemeIntro themeConfig={themeConfig} />

              {/* File Drop / Photo uploader */}
              <PhotoUploader
                themeConfig={themeConfig}
                isDragActive={isDragActive}
                error={error}
                isLoading={isPhotoLoading}
                onDrag={handleDrag}
                onDrop={handleDrop}
                onFileChange={handleFileChange}
              />

            </motion.div>
          )}

          {/* FLOW STATE: PHOTO_SELECTED (Edit details & Live preview screen) */}
          {flowState === 'PHOTO_SELECTED' && (
            <motion.div
              key="state-photo-selected"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >

              {/* Back navigation */}
              <div className="mb-6 flex justify-start">
                <button
                  onClick={handleBackToUpload}
                  className={`
                    px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border-2
                    ${isGoa
                      ? 'bg-white text-[#083C26] border-[#083C26] hover:bg-[#FFE566]'
                      : 'bg-[#131921] text-[#F2EFE9] border-white/10 hover:bg-[#1C2530]'}
                  `}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Change Photo</span>
                </button>
              </div>

              {/* Main edit workspace split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* Form column */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`
                    p-6 md:p-8 rounded-2xl transition-all duration-350 select-none
                    ${isGoa ? 'glass-panel-goa' : 'glass-panel-aot'}
                  `}
                >

                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className={`w-5 h-5 ${isGoa ? 'text-[#FF2E93]' : 'text-[#E05A1F]'}`} />

                    <h2 className={`font-bold text-lg uppercase tracking-wider ${isGoa ? 'text-[#083C26]' : 'text-[#F2EFE9]'}`}>
                      BUILDER INFO
                    </h2>
                  </div>

                  {/* Builder details input fields */}
                  <BuilderForm
                    themeConfig={themeConfig}
                    values={details}
                    onValueChange={handleValueChange}
                    title={details.title}
                    onRegenerateTitle={handleRegenerateTitle}
                  />

                  {/* CTA Generate card/poster */}
                  <button
                    onClick={handleGenerateCard}
                    className={`
                      w-full mt-8 py-4 px-6 rounded-2xl font-black text-sm md:text-base flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border-2 shadow-md
                      ${isGoa
                        ? 'bg-[#083C26] text-[#FFE566] border-[#083C26] hover:bg-[#FFE566] hover:text-[#083C26] shadow-[4px_4px_0px_0px_#083C26]'
                        : 'bg-[#B22222] text-[#F2EFE9] border-[#B22222] hover:bg-[#E05A1F] hover:border-[#E05A1F]'}
                    `}
                  >
                    <span>
                      {isGoa ? 'GENERATE BUILDER CARD' : 'GENERATE CINEMATIC POSTER'}
                    </span>
                  </button>

                  {/* Errors in edit screen */}
                  {error && (
                    <p className="text-center font-bold text-xs uppercase text-red-500 mt-4 tracking-wide">
                      {error}
                    </p>
                  )}

                </motion.div>

                {/* Preview column */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex flex-col items-center justify-center lg:sticky lg:top-6"
                >

                  {/* Clickable Live Preview Trigger Button */}
                  <button
                    onClick={() => previewDataUrl && setIsModalOpen(true)}
                    disabled={!previewDataUrl}
                    className={`
                      flex items-center gap-2 mb-4 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer border-2 shadow-sm
                      ${isGoa
                        ? 'bg-[#083C26] text-[#FFE566] border-[#083C26] hover:bg-[#FFE566] hover:text-[#083C26] shadow-[2px_2px_0px_0px_#083C26]'
                        : 'bg-[#1D2633] text-[#F2EFE9] border-white/10 hover:bg-[#E05A1F] hover:border-[#E05A1F]'}
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                    title="Open Large Frame Preview"
                  >
                    <ImageIcon className="w-4 h-4 animate-pulse" />

                    <span>
                      {isPreviewLoading
                        ? 'PREPARING PREVIEW...'
                        : !previewDataUrl
                          ? 'PREVIEW UNAVAILABLE'
                          : 'LIVE PREVIEW'}
                    </span>
                  </button>

                  {/* Card preview */}
                  <CardPreview
                    themeConfig={themeConfig}
                    details={details}
                    photoSrc={photoSrc}
                    previewDataUrl={previewDataUrl}
                    isPreviewLoading={isPreviewLoading}
                  />

                </motion.div>
              </div>
            </motion.div>
          )}

          {/* FLOW STATE: RESULT (Download & Share screen) */}
          {flowState === 'RESULT' && (
            <motion.div
              key="state-result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >

              <ResultScreen
                themeConfig={themeConfig}
                imageUrl={generatedCardUrl}
                name={details.name}
                role={details.role}
                title={details.title}
                onReset={handleReset}
                onBack={handleBackToEdit}
              />

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* 3. Loading experience full-screen */}
      {flowState === 'GENERATING' && (
        <GenerationState themeConfig={themeConfig} />
      )}

      {/* 4. Live Preview Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && previewDataUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#090D12]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
            onClick={() => setIsModalOpen(false)}
          >

            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#F2EFE9] hover:text-[#E05A1F] transition-colors p-3 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer z-55 shadow-md flex items-center justify-center"
              title="Close Preview"
              aria-label="Close Preview"
            >
              <X className="w-6 h-6" />
            </button>

            {/* High-res Image Poster Frame container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg aspect-[4/5] overflow-hidden rounded-2xl border-4 border-white/10 shadow-2xl flex items-center justify-center bg-[#090D12]"
              onClick={(e) => e.stopPropagation()}
            >

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewDataUrl}
                alt="High resolution frame preview"
                className="w-full h-full object-contain pointer-events-none"
              />

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function Home() {
  return <BuilderAppContent />;
}