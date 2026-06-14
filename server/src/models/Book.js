import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title_ar: { type: String, required: true },
  title_en: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  isbn: { type: String },
  description_ar: { type: String, required: true },
  description_en: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  stock: { type: Number, default: 0 },
  coverImage: { type: String },
  galleryImages: [{ type: String }],
  pdfPreview: { type: String },
  language: { type: String, enum: ['ar', 'en', 'both'], default: 'ar' },
  category: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  pages: { type: Number },
}, { timestamps: true });

bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

const Book = mongoose.model('Book', bookSchema);
export default Book;
