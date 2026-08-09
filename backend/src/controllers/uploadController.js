import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import asyncHandler from '../utils/asyncHandler.js';

// Helper to upload buffer to Cloudinary
const uploadBufferToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'lumio_cards',
        public_id: filename,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// @desc    Upload image to Cloudinary (or fallback storage)
// @route   POST /api/upload
// @access  Protected / Public
export const uploadImage = asyncHandler(async (req, res) => {
  let imageUrl = '';

  // 1. If file uploaded via Multer (multipart/form-data)
  if (req.file) {
    if (isCloudinaryConfigured()) {
      const cleanName = (req.body.name || 'image').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const filename = `lumio-${cleanName}-${Date.now()}`;
      const result = await uploadBufferToCloudinary(req.file.buffer, filename);
      imageUrl = result.secure_url;
    } else {
      // Fallback if no Cloudinary keys: convert buffer to data URI or use tmpfiles
      const base64 = req.file.buffer.toString('base64');
      const mime = req.file.mimetype || 'image/png';
      imageUrl = `data:${mime};base64,${base64}`;
    }
  } 
  // 2. If base64 JSON payload uploaded (`{ image: "data:image/png;base64,...", name: "..." }`)
  else if (req.body && req.body.image) {
    const { image, name } = req.body;
    if (isCloudinaryConfigured()) {
      const cleanName = (name || 'card').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const result = await cloudinary.uploader.upload(image, {
        folder: 'lumio_cards',
        public_id: `lumio-${cleanName}-${Date.now()}`,
      });
      imageUrl = result.secure_url;
    } else {
      // Ephemeral tmpfiles.org upload fallback if Cloudinary is not configured yet
      try {
        const base64Data = image.split(',')[1] || image;
        const buffer = Buffer.from(base64Data, 'base64');
        const formData = new FormData();
        const cleanName = (name || 'builder').toLowerCase().replace(/[^a-z0-9]/g, '-');
        const filename = `hackerhouse-goa-2026-${cleanName}-${Date.now()}.png`;
        const blob = new Blob([buffer], { type: 'image/png' });
        formData.append('file', blob, filename);

        const uploadRes = await fetch('https://tmpfiles.org/api/v1/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const result = await uploadRes.json();
          if (result.status === 'success' && result.data?.url) {
            imageUrl = result.data.url.replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/');
          }
        }
      } catch (err) {
        console.error('Fallback upload warning:', err.message);
      }

      if (!imageUrl) {
        imageUrl = image; // Return base64 as final fallback
      }
    }
  } else {
    res.status(400);
    throw new Error('No image file or base64 image data provided');
  }

  res.status(200).json({
    success: true,
    url: imageUrl,
  });
});
