import mongoose from 'mongoose';

const libraryResourceSchema = new mongoose.Schema({
  title_ar: { type: String, required: true },
  title_en: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description_ar: { type: String, required: true },
  description_en: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  fileUrl: { type: String, required: true },
  thumbnail: { type: String },
  isDownloadable: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
  downloadSize: { type: String }, // e.g., '2.5 MB'
  fileType: { type: String, default: 'PDF' },
  views: { type: Number, default: () => Math.floor(Math.random() * 500) + 1000 },
  reviewsCount: { type: Number, default: () => Math.floor(Math.random() * 50) + 100 },
  rating: { type: Number, default: () => parseFloat((Math.random() * 0.4 + 4.5).toFixed(1)) },
}, { timestamps: true });

// Virtuals for frontend ease
libraryResourceSchema.set('toJSON', { virtuals: true });
libraryResourceSchema.set('toObject', { virtuals: true });

const LibraryResource = mongoose.model('LibraryResource', libraryResourceSchema);
export default LibraryResource;
