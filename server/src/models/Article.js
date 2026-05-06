import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title_ar:    { type: String, required: true },
  title_en:    { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  excerpt_ar:  { type: String },
  excerpt_en:  { type: String },
  content_ar:  { type: String },
  content_en:  { type: String },
  author_ar:   { type: String },
  author_en:   { type: String },
  category_ar: { type: String },
  category_en: { type: String },
  tags:        [{ type: String }],
  date:        { type: String },
  readTime:    { type: Number, default: 5 },
  featured:    { type: Boolean, default: false },
  status:      { type: String, enum: ['published', 'draft'], default: 'draft' },
  image:       { type: String, default: null },     // Cloudinary URL
  type:        { type: String, default: 'general' },
}, { timestamps: true });

export default mongoose.model('Article', articleSchema);
