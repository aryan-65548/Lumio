/**
 * Convert a file to a Base64 string.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Client-side HEIC to PNG conversion helper.
 * Imports heic2any dynamically to prevent SSR building issues.
 */
export async function convertHeicToPng(file: File): Promise<File> {
  if (typeof window === 'undefined') return file;
  
  const isHeic = 
    file.type === 'image/heic' || 
    file.type === 'image/heif' || 
    file.name.toLowerCase().endsWith('.heic') || 
    file.name.toLowerCase().endsWith('.heif');
    
  if (!isHeic) return file;

  try {
    const heic2any = (await import('heic2any')).default;
    const blob = await heic2any({
      blob: file,
      toType: 'image/png',
      quality: 0.9,
    });
    
    const outputBlob = Array.isArray(blob) ? blob[0] : blob;
    const newName = file.name.replace(/\.(heic|heif)$/i, '.png');
    return new File([outputBlob], newName, { type: 'image/png' });
  } catch (error) {
    console.error('HEIC conversion failed, falling back to original file:', error);
    return file;
  }
}

/**
 * Calculates optimal source crop dimensions for a 1:1 aspect ratio PFP container.
 * Intelligently shifts vertical crop coordinates upward for portrait images to ensure face retention.
 */
export interface CropData {
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
}

export function getSmartCropData(imgWidth: number, imgHeight: number): CropData {
  let sx = 0;
  let sy = 0;
  let sWidth = imgWidth;
  let sHeight = imgHeight;

  if (imgWidth > imgHeight) {
    // Landscape photo: Crop horizontally from center
    sWidth = imgHeight;
    sx = (imgWidth - imgHeight) / 2;
  } else if (imgHeight > imgWidth) {
    // Portrait photo: Crop vertically
    sHeight = imgWidth;
    // Shift crop box UP by 15% of the excess height to keep faces visible
    const excessHeight = imgHeight - imgWidth;
    const centerSy = excessHeight / 2;
    const shiftUp = excessHeight * 0.15;
    sy = Math.max(0, centerSy - shiftUp);
  }

  return { sx, sy, sWidth, sHeight };
}

/**
 * Calculates optimal source crop dimensions for a custom target aspect ratio.
 * Intelligently shifts vertical crop coordinates upward for portrait images to ensure face retention.
 */
export function getSmartCropDataForRatio(
  imgWidth: number,
  imgHeight: number,
  targetRatio: number // width / height
): CropData {
  let sx = 0;
  let sy = 0;
  let sWidth = imgWidth;
  let sHeight = imgHeight;

  const currentRatio = imgWidth / imgHeight;

  if (currentRatio > targetRatio) {
    // Landscape crop: crop horizontally from center
    sWidth = imgHeight * targetRatio;
    sx = (imgWidth - sWidth) / 2;
  } else if (currentRatio < targetRatio) {
    // Portrait crop: crop vertically, shifting slightly upward to preserve face
    sHeight = imgWidth / targetRatio;
    const excessHeight = imgHeight - sHeight;
    const centerSy = excessHeight / 2;
    const shiftUp = excessHeight * 0.15;
    sy = Math.max(0, centerSy - shiftUp);
  }

  return { sx, sy, sWidth, sHeight };
}

/**
 * Applies a cinematic, AOT-themed color grading filter directly to raw pixel buffer.
 * Blends cool teal shadows with warm orange/red highlights, desaturates, and boosts contrast.
 */
export function applyAotColorGrading(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  try {
    const imgData = ctx.getImageData(x, y, w, h);
    const data = imgData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i+1];
      let b = data[i+2];

      // 1. Boost contrast slightly
      const contrast = 1.35;
      r = 128 + (r - 128) * contrast;
      g = 128 + (g - 128) * contrast;
      b = 128 + (b - 128) * contrast;

      // 2. Grayscale luminance
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;

      // 3. Desaturate by 40% (retain 60% color)
      const sat = 0.55;
      r = luma * (1 - sat) + r * sat;
      g = luma * (1 - sat) + g * sat;
      b = luma * (1 - sat) + b * sat;

      // 4. Color grading highlights (warm orange/red) and shadows (cool teal/blue)
      if (luma > 128) {
        const t = (luma - 128) / 128;
        r += 32 * t; // red boost
        g += 10 * t; // yellow boost
        b -= 18 * t; // blue reduction
      } else {
        const t = (128 - luma) / 128;
        r -= 20 * t; // red reduction
        g += 6 * t;  // green boost
        b += 20 * t; // blue boost
      }

      // Clamp values
      data[i] = Math.min(255, Math.max(0, r));
      data[i+1] = Math.min(255, Math.max(0, g));
      data[i+2] = Math.min(255, Math.max(0, b));
    }
    
    ctx.putImageData(imgData, x, y);
  } catch (error) {
    console.error('Error applying AOT color grading:', error);
  }
}

