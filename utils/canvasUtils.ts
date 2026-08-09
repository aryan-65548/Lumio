import { ThemeConfig } from '../types/theme';
import { BuilderDetails } from '../types/builder';
import { CARD_WIDTH, CARD_HEIGHT } from '../constants/themes';
import { getSmartCropData, getSmartCropDataForRatio, applyAotColorGrading } from './imageUtils';

export interface WrapTextOptions {
  ctx: CanvasRenderingContext2D;
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  lineHeight: number;
  maxLines?: number;
  font: string;
  fillStyle: string;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
}

export interface WrapTextResult {
  lines: string[];
  totalHeight: number;
  endY: number;
}

/**
 * Reusable Canvas Text Wrapping & Truncation Utility
 * Automatically wraps text into multiple lines fitting within maxWidth.
 * If lines exceed maxLines, truncates gracefully with "...".
 * Returns rendered lines, total height, and end Y coordinate for dynamic positioning.
 */
export function wrapText(options: WrapTextOptions): WrapTextResult {
  const {
    ctx,
    text,
    x,
    y,
    maxWidth,
    lineHeight,
    maxLines = 10,
    font,
    fillStyle,
    textAlign = 'left',
    textBaseline = 'top',
  } = options;

  if (!text || !text.trim()) {
    return { lines: [], totalHeight: 0, endY: y };
  }

  ctx.save();
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;

  // Split text into words
  const words = text.trim().split(/\s+/);
  const rawLines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        rawLines.push(currentLine);
        currentLine = word;
      } else {
        // Handle single word wider than maxWidth by breaking characters
        let subWord = '';
        for (let charIndex = 0; charIndex < word.length; charIndex++) {
          const char = word[charIndex];
          if (ctx.measureText(subWord + char).width <= maxWidth) {
            subWord += char;
          } else {
            if (subWord) rawLines.push(subWord);
            subWord = char;
          }
        }
        currentLine = subWord;
      }
    }
  }

  if (currentLine) {
    rawLines.push(currentLine);
  }

  // Handle maxLines truncation with "..."
  const finalLines: string[] = [];
  if (rawLines.length > maxLines) {
    for (let i = 0; i < maxLines - 1; i++) {
      finalLines.push(rawLines[i]);
    }
    let lastLine = rawLines[maxLines - 1];
    let truncated = `${lastLine}...`;
    while (ctx.measureText(truncated).width > maxWidth && lastLine.length > 0) {
      lastLine = lastLine.slice(0, -1);
      truncated = `${lastLine}...`;
    }
    finalLines.push(truncated);
  } else {
    finalLines.push(...rawLines);
  }

  // Render each line onto canvas
  for (let i = 0; i < finalLines.length; i++) {
    const lineY = y + i * lineHeight;
    ctx.fillText(finalLines[i], x, lineY);
  }

  ctx.restore();

  const totalHeight = finalLines.length * lineHeight;
  return {
    lines: finalLines,
    totalHeight,
    endY: y + totalHeight,
  };
}

/**
 * Loads an image from a URL programmatically
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load template image: ${src}`));
    img.src = src;
  });
}

/**
 * Draw film grain overlay for texturing
 */
function drawFilmGrain(ctx: CanvasRenderingContext2D, opacity: number) {
  const imgData = ctx.getImageData(0, 0, CARD_WIDTH, CARD_HEIGHT);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 255 * opacity;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));     // R
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise)); // G
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise)); // B
  }
  ctx.putImageData(imgData, 0, 0);
}

/**
 * Draws rounded rectangle path on canvas
 */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Draw Goa Beach Template card with dynamic text layout & multiline wrapping
 */
async function renderGoaCard(
  ctx: CanvasRenderingContext2D,
  details: BuilderDetails,
  photoSrc: string | null
) {
  // 1. Fill base sand color background
  ctx.fillStyle = '#E8D8B6';
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // 2. Draw sunset sky gradient at top
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 135);
  skyGrad.addColorStop(0, '#00A3E0');
  skyGrad.addColorStop(1, '#FFE566');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, CARD_WIDTH, 135);

  // 3. Draw sand color at bottom
  ctx.fillStyle = '#E8D8B6';
  ctx.fillRect(0, 1215, CARD_WIDTH, 135);

  // 4. Load and draw the main clean Goa Beach template frame
  const frameImg = await loadImage('/assets/templates/goa-frame.png');
  ctx.drawImage(frameImg, 0, 135, CARD_WIDTH, 1080); 

  // 5. Draw user photo inside circular cutout
  const cx = 338;
  const cy = 725;
  const radius = 248;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  if (photoSrc) {
    const img = await loadImage(photoSrc);
    const crop = getSmartCropData(img.width, img.height);
    ctx.drawImage(
      img,
      crop.sx,
      crop.sy,
      crop.sWidth,
      crop.sHeight,
      cx - radius,
      cy - radius,
      radius * 2,
      radius * 2
    );
  } else {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  }
  ctx.restore();

  // 6. Draw dynamic details text floating onto beach background
  const startX = 630;
  const maxRightX = 1040;
  const maxWidth = maxRightX - startX; // 410px max available width
  let currentY = 580; // Starting Y coordinate

  const drawGoaUnderline = (yPos: number, width: number) => {
    ctx.beginPath();
    ctx.strokeStyle = '#FF2E93'; // Hot pink accent
    ctx.lineWidth = 3.5;
    ctx.moveTo(startX, yPos);
    ctx.lineTo(startX + Math.min(width, maxWidth), yPos);
    ctx.stroke();
  };

  // NAME (Font: Cinzel 40px)
  const nameText = (details.name || 'Your Name').toUpperCase();
  const nameRes = wrapText({
    ctx,
    text: nameText,
    x: startX,
    y: currentY,
    maxWidth,
    lineHeight: 46,
    maxLines: 2,
    font: '500 40px Cinzel, serif',
    fillStyle: '#083C26',
  });

  // Pink underline for Name
  drawGoaUnderline(nameRes.endY + 6, 320);
  currentY = nameRes.endY + 28;

  // ROLE (Font: Syne 24px)
  const roleText = `👤  ${(details.role || 'Your Role').toUpperCase()}`;
  const roleRes = wrapText({
    ctx,
    text: roleText,
    x: startX,
    y: currentY,
    maxWidth,
    lineHeight: 30,
    maxLines: 2,
    font: '800 24px Syne, sans-serif',
    fillStyle: '#083C26',
  });

  drawGoaUnderline(roleRes.endY + 4, 260);
  currentY = roleRes.endY + 28;

  // TECH STACK (Font: Inter 20px)
  const techText = `</>  ${(details.techStack || 'Your Stack').toUpperCase()}`;
  const techRes = wrapText({
    ctx,
    text: techText,
    x: startX,
    y: currentY,
    maxWidth,
    lineHeight: 26,
    maxLines: 2,
    font: 'bold 20px Inter, sans-serif',
    fillStyle: '#083C26',
  });

  drawGoaUnderline(techRes.endY + 4, 340);
  currentY = techRes.endY + 28;

  // BUILDER TITLE (Font: Syne 24px)
  if (details.title) {
    const titleText = `🌴  ${details.title.toUpperCase()}`;
    const titleRes = wrapText({
      ctx,
      text: titleText,
      x: startX,
      y: currentY,
      maxWidth,
      lineHeight: 30,
      maxLines: 2,
      font: 'bold 24px Syne, sans-serif',
      fillStyle: '#083C26',
    });

    drawGoaUnderline(titleRes.endY + 4, 280);
  }
}

/**
 * Draw AOT Template card with dynamic text layout & multiline wrapping
 */
async function renderAotCard(
  ctx: CanvasRenderingContext2D,
  details: BuilderDetails,
  photoSrc: string | null
) {
  // 1. Draw AOT background template poster
  const frameImg = await loadImage('/assets/templates/aot-frame.png');
  ctx.drawImage(frameImg, 0, 0, CARD_WIDTH, CARD_HEIGHT);

  // 2. Draw user photo inside placeholder box
  const boxX = 381;
  const boxY = 353;
  const boxW = 342;
  const boxH = 291;
  const cornerRad = 35;

  if (photoSrc) {
    ctx.save();
    roundRect(ctx, boxX, boxY, boxW, boxH, cornerRad);
    ctx.clip();

    const img = await loadImage(photoSrc);
    const crop = getSmartCropDataForRatio(img.width, img.height, boxW / boxH);
    ctx.drawImage(
      img,
      crop.sx,
      crop.sy,
      crop.sWidth,
      crop.sHeight,
      boxX,
      boxY,
      boxW,
      boxH
    );
    
    applyAotColorGrading(ctx, boxX, boxY, boxW, boxH);

    // Subtle warm orange rim highlight from right
    const rimGrad = ctx.createLinearGradient(boxX + boxW - 20, boxY, boxX + boxW, boxY);
    rimGrad.addColorStop(0, 'rgba(224, 90, 31, 0)');
    rimGrad.addColorStop(1, 'rgba(224, 90, 31, 0.4)');
    ctx.fillStyle = rimGrad;
    ctx.fillRect(boxX + boxW - 20, boxY, 20, boxH);

    // Subtle cool teal shadow from left
    const shadowGrad = ctx.createLinearGradient(boxX, boxY, boxX + 20, boxY);
    shadowGrad.addColorStop(0, 'rgba(15, 34, 41, 0.45)');
    shadowGrad.addColorStop(1, 'rgba(15, 34, 41, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.fillRect(boxX, boxY, 20, boxH);
    
    // Inner shadow overlay
    const vigGrad = ctx.createRadialGradient(
      boxX + boxW / 2, boxY + boxH / 2, 40,
      boxX + boxW / 2, boxY + boxH / 2, 160
    );
    vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vigGrad.addColorStop(1, 'rgba(9, 13, 18, 0.5)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.restore();

    // Border around photo
    ctx.strokeStyle = '#593c30';
    ctx.lineWidth = 3.5;
    roundRect(ctx, boxX, boxY, boxW, boxH, cornerRad);
    ctx.stroke();
  }

  // 3. Draw User Details on the LEFT side of the photo with dynamic Y stacking
  const textStartX = 86;
  const maxRightX = 365; // 16px padding before photo box at x=381
  const maxWidth = maxRightX - textStartX; // 279px max available width
  let currentY = 385; // Starting Y coordinate for section 1

  const drawAotSection = (
    label: string,
    value: string,
    valueFont: string,
    lineHeight: number,
    maxLines: number = 2
  ): number => {
    // Label rendering (ember fire orange stenciled text)
    ctx.fillStyle = '#E24A00';
    ctx.font = '900 15px Cinzel, serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    let labelX = textStartX;
    const spacing = 1.8;
    for (let i = 0; i < label.length; i++) {
      const char = label[i];
      ctx.fillText(char, labelX, currentY);
      labelX += ctx.measureText(char).width + spacing;
    }

    // Accent line below label
    ctx.beginPath();
    ctx.strokeStyle = '#E24A00';
    ctx.lineWidth = 1.5;
    ctx.moveTo(textStartX, currentY + 18);
    ctx.lineTo(labelX - spacing, currentY + 18);
    ctx.stroke();

    // Value multiline wrapped text
    const valueY = currentY + 24;
    const valRes = wrapText({
      ctx,
      text: value.toUpperCase(),
      x: textStartX,
      y: valueY,
      maxWidth,
      lineHeight,
      maxLines,
      font: valueFont,
      fillStyle: '#F2EFE9',
    });

    // Return next starting Y (bottom of value + vertical gap)
    return valRes.endY + 14;
  };

  // Section 1: Title
  currentY = drawAotSection(
    'BUILDER TITLE',
    details.title || 'ANONYMOUS BUILDER',
    '900 20px Cinzel, serif',
    24,
    2
  );

  // Section 2: Name
  currentY = drawAotSection(
    'NAME',
    details.name || 'Your Name',
    '900 19px Cinzel, serif',
    23,
    2
  );

  // Section 3: Role
  currentY = drawAotSection(
    'ROLE',
    details.role || 'Your Role',
    '900 19px Cinzel, serif',
    23,
    2
  );

  // Section 4: Tech Stack
  currentY = drawAotSection(
    'TECH STACK',
    details.techStack || 'React • Next.js',
    '900 16px Cinzel, serif',
    20,
    2
  );
}

/**
 * Main function to draw card using HTML Canvas
 */
export async function renderCardToCanvas(
  canvas: HTMLCanvasElement,
  theme: ThemeConfig,
  details: BuilderDetails,
  photoSrc: string | null
): Promise<void> {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context');

  // Clear canvas
  ctx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Draw matching layout based on theme choice
  if (theme.id === 'goa') {
    await renderGoaCard(ctx, details, photoSrc);
  } else {
    await renderAotCard(ctx, details, photoSrc);
  }

  // Apply subtle film grain noise to bind elements together
  drawFilmGrain(ctx, theme.background.noiseOpacity);
}
