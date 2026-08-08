const fs = require('fs');
const path = require('path');

try {
  const sharp = require('sharp');
  sharp(path.join(__dirname, '../public/assets/templates/aot-frame.png'))
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      // Print the color at the center of the image (x = Width/2, y = Height/3)
      const cx = Math.round(info.width / 2);
      const cy = Math.round(info.height * 0.35); // 35% from top
      const idx = (cy * info.width + cx) * 3;
      const r = data[idx];
      const g = data[idx+1];
      const b = data[idx+2];
      
      console.log('CENTER_PIXEL_COLOR:', { r, g, b, hex: `#${r.toString(16)}${g.toString(16)}${b.toString(16)}` });

      // Scan for exact matches of this color
      let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
      let found = 0;
      
      for (let y = 0; y < info.height; y++) {
        for (let x = 0; x < info.width; x++) {
          const pIdx = (y * info.width + x) * 3;
          // Look for exact color match (or very close)
          if (data[pIdx] === r && data[pIdx+1] === g && data[pIdx+2] === b) {
            found++;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      
      console.log('BOX_BOUNDING_BOX:', {
        minX,
        maxX,
        minY,
        maxY,
        width: maxX - minX,
        height: maxY - minY,
        totalPixels: found,
        scaledX: Math.round(minX * (1080 / info.width)),
        scaledY: Math.round(minY * (1350 / info.height)),
        scaledWidth: Math.round((maxX - minX) * (1080 / info.width)),
        scaledHeight: Math.round((maxY - minY) * (1350 / info.height))
      });
    })
    .catch(err => {
      console.log('Sharp error:', err.message);
    });
} catch (e) {
  console.log('Sharp is not installed:', e.message);
}
