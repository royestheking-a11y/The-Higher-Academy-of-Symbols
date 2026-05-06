import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB

const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// POST /api/upload — universal media upload
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });

    const { mimetype, originalname, buffer } = req.file;
    const folder = req.body.folder || 'symbols_academy/general';

    let resourceType = 'image';
    if (mimetype.startsWith('video/')) resourceType = 'video';
    else if (mimetype === 'application/pdf' || mimetype.startsWith('application/')) resourceType = 'raw';

    const options = {
      folder,
      resource_type: resourceType,
      public_id: `${Date.now()}_${originalname.replace(/\.[^/.]+$/, '').replace(/\s+/g, '_')}`,
      overwrite: false,
    };

    const result = await uploadToCloudinary(buffer, options);

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
      size: result.bytes,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

export default router;
