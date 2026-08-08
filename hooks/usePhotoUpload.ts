'use client';

import { useState, useCallback } from 'react';
import { fileToBase64, convertHeicToPng } from '../utils/imageUtils';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function usePhotoUpload() {
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const processFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    // 1. Validation
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isValidType = ALLOWED_TYPES.includes(file.type) || ['heic', 'heif'].includes(ext || '');
    
    if (!isValidType) {
      setError('Unsupported file type. Please upload JPG, PNG, WEBP, or HEIC.');
      setIsLoading(false);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size too large. Maximum size is 10 MB.');
      setIsLoading(false);
      return;
    }

    try {
      // 2. Convert HEIC to PNG if necessary
      const readyFile = await convertHeicToPng(file);
      
      // 3. Convert to Base64 for client preview/state
      const base64 = await fileToBase64(readyFile);
      setPhotoSrc(base64);
      setFileName(readyFile.name);
    } catch (err) {
      console.error(err);
      setError('Failed to process image. Please try another file.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const clearPhoto = useCallback(() => {
    setPhotoSrc(null);
    setFileName('');
    setError(null);
  }, []);

  return {
    photoSrc,
    fileName,
    isDragActive,
    error,
    isLoading,
    handleDrag,
    handleDrop,
    handleFileChange,
    clearPhoto,
    setError
  };
}
