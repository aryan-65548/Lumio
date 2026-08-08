import { ThemeConfig } from '../types/theme';
import { BuilderDetails } from '../types/builder';
import { CARD_WIDTH, CARD_HEIGHT } from '../constants/themes';
import { getSmartCropData, getSmartCropDataForRatio, applyAotColorGrading } from './imageUtils';

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
 * Draw Goa Beach Template card
 */
async function renderGoaCard(
  ctx: CanvasRenderingContext2D,
  details: BuilderDetails,
  photoSrc: string | null
) {
  // 1. Fill base sand color background
  ctx.fillStyle = '#E8D8B6';
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // 2. Draw sunset sky gradient at the top (to blend template top)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 135);
  skyGrad.addColorStop(0, '#00A3E0');
  skyGrad.addColorStop(1, '#FFE566');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, CARD_WIDTH, 135);

  // 3. Draw sand color at the bottom (to blend template bottom)
  ctx.fillStyle = '#E8D8B6';
  ctx.fillRect(0, 1215, CARD_WIDTH, 135);

  // 4. Load and draw the main clean Goa Beach template frame (1:1 ratio centered vertically)
  const frameImg = await loadImage('/assets/templates/goa-frame.png');
  ctx.drawImage(frameImg, 0, 135, CARD_WIDTH, 1080); 

  // 5. Draw user photo inside the circular white template cutout
  // The cutout circle is at Cx = 338, Cy = 725, Radius = 248 on the 1080x1350 canvas
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
    // Avatar placeholder (transparent if empty so template stays clean)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  }
  ctx.restore();

  // 6. Draw dynamic details text floating directly onto the new clean sunset beach background
  // No boxes, no panels, deep green typography, hot pink underlines.
  // Shifted DOWN to y = 590 to leave breathing room under the "BUILDING IDEAS, CHILLING IN GOA" logo.
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const startX = 630;
  
  const drawGoaField = (text: string, y: number, font: string, underlineWidth: number) => {
    ctx.fillStyle = '#083C26'; // Deep tropical green
    ctx.font = font;
    ctx.fillText(text.toUpperCase(), startX, y);

    // Draw hot pink underline below the text block
    ctx.beginPath();
    ctx.strokeStyle = '#FF2E93'; // Hot pink accent
    ctx.lineWidth = 3;
    ctx.moveTo(startX, y + 34);
    ctx.lineTo(startX + underlineWidth, y + 34);
    ctx.stroke();
  };

  // NAME: Elegant narrow display typography (Cinzel) at y = 590
  ctx.fillStyle = '#083C26';
  ctx.font = '500 42px Cinzel, serif';
  ctx.fillText((details.name || 'Your Name').toUpperCase(), startX, 590);
  
  // Draw pink underline below Name
  ctx.beginPath();
  ctx.strokeStyle = '#FF2E93';
  ctx.lineWidth = 4.5;
  ctx.moveTo(startX, 590 + 52);
  ctx.lineTo(startX + 320, 590 + 52);
  ctx.stroke();

  // ROLE: with user icon at y = 670
  drawGoaField(`👤  ${details.role || 'Your Role'}`, 670, '800 24px Syne, sans-serif', 260);

  // TECH STACK: with code icon at y = 750
  drawGoaField(`</>  ${details.techStack || 'Your Stack'}`, 750, 'bold 20px Inter, sans-serif', 340);

  // BUILDER TITLE: with palm tree icon at y = 830
  if (details.title) {
    drawGoaField(`🌴  ${details.title}`, 830, 'bold 24px Syne, sans-serif', 280);
  }
}

/**
 * Draw AOT Template card
 * Draws user photo exactly inside the brown placeholder rectangle AND draws details text to the right
 */
async function renderAotCard(
  ctx: CanvasRenderingContext2D,
  details: BuilderDetails,
  photoSrc: string | null
) {
  // 1. Draw the AOT background template poster
  const frameImg = await loadImage('/assets/templates/aot-frame.png');
  ctx.drawImage(frameImg, 0, 0, CARD_WIDTH, CARD_HEIGHT); // fills 1080x1350 aspect ratio

  // 2. Draw user photo replacing the brown placeholder box
  // Bounding box coordinates of brown box scaled to 1080x1350:
  // x = 381, y = 353, width = 342, height = 291. Corner radius = 35.
  const boxX = 381;
  const boxY = 353;
  const boxW = 342;
  const boxH = 291;
  const cornerRad = 35;

  if (photoSrc) {
    ctx.save();
    // Clip photo to the exact rounded placeholder shape
    roundRect(ctx, boxX, boxY, boxW, boxH, cornerRad);
    ctx.clip();

    const img = await loadImage(photoSrc);
    // Use exact aspect ratio crop (342/291 = 1.175) to prevent distortion
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
    
    // Apply AOT color grading to the user's photo inside the canvas
    applyAotColorGrading(ctx, boxX, boxY, boxW, boxH);

    // Subtle warm orange rim highlight from the right (fire light match)
    const rimGrad = ctx.createLinearGradient(boxX + boxW - 20, boxY, boxX + boxW, boxY);
    rimGrad.addColorStop(0, 'rgba(224, 90, 31, 0)');
    rimGrad.addColorStop(1, 'rgba(224, 90, 31, 0.4)');
    ctx.fillStyle = rimGrad;
    ctx.fillRect(boxX + boxW - 20, boxY, 20, boxH);

    // Subtle cool teal shadow from the left
    const shadowGrad = ctx.createLinearGradient(boxX, boxY, boxX + 20, boxY);
    shadowGrad.addColorStop(0, 'rgba(15, 34, 41, 0.45)');
    shadowGrad.addColorStop(1, 'rgba(15, 34, 41, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.fillRect(boxX, boxY, 20, boxH);
    
    // Vignette / inner shadow overlay
    const vigGrad = ctx.createRadialGradient(
      boxX + boxW / 2, boxY + boxH / 2, 40,
      boxX + boxW / 2, boxY + boxH / 2, 160
    );
    vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vigGrad.addColorStop(1, 'rgba(9, 13, 18, 0.5)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.restore();

    // Draw a subtle border around the photo
    ctx.strokeStyle = '#593c30';
    ctx.lineWidth = 3.5;
    roundRect(ctx, boxX, boxY, boxW, boxH, cornerRad);
    ctx.stroke();
  }

  // 3. Draw User Details on the LEFT side of the photo (X starting around x = 86)
  // We place details in the region: x = 86 to 350, aligned vertically with the photo (y = 395 to 645)
  // Micro-adjusted RIGHT to textStartX = 86 to balance empty wall margins.
  const textStartX = 86;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const drawAotField = (label: string, value: string, labelY: number, valueY: number, valueFont: string) => {
    // Draw stenciled label in rich saturated ember fire orange (#E24A00)
    ctx.fillStyle = '#E24A00';
    ctx.font = '900 16px Cinzel, serif';
    
    // Draw letter-spaced label for military-stencil poster look
    let currentX = textStartX;
    const spacing = 1.8;
    for (let i = 0; i < label.length; i++) {
      const char = label[i];
      ctx.fillText(char, currentX, labelY);
      currentX += ctx.measureText(char).width + spacing;
    }

    // Draw subtle thin orange accent divider line below the label
    ctx.beginPath();
    ctx.strokeStyle = '#E24A00';
    ctx.lineWidth = 1.5;
    ctx.moveTo(textStartX, labelY + 20);
    ctx.lineTo(currentX - spacing, labelY + 20);
    ctx.stroke();

    // Draw value in cream/off-white (rugged stenciled display serif font)
    ctx.fillStyle = '#F2EFE9';
    ctx.font = valueFont;
    ctx.fillText(value.toUpperCase(), textStartX, valueY);
  };

  // Section 1: Title (Label: "BUILDER TITLE")
  drawAotField('BUILDER TITLE', details.title || 'ANONYMOUS BUILDER', 395, 423, '900 22px Cinzel, serif');

  // Section 2: Name (Label: "NAME")
  drawAotField('NAME', details.name || 'Your Name', 465, 493, '900 20px Cinzel, serif');

  // Section 3: Role (Label: "ROLE")
  drawAotField('ROLE', details.role || 'Your Role', 535, 563, '900 20px Cinzel, serif');

  // Section 4: Tech Stack (Label: "TECH STACK")
  drawAotField('TECH STACK', details.techStack || 'React • Next.js', 605, 633, '900 17px Cinzel, serif');
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
