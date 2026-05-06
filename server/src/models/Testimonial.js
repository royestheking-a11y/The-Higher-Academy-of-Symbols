import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  name_en:    { type: String },
  country_ar: { type: String },
  country_en: { type: String },
  course_ar:  { type: String },
  course_en:  { type: String },
  rating:     { type: Number, min: 1, max: 5, default: 5 },
  message_ar: { type: String },
  message_en: { type: String },
  avatar:     { type: String, default: '' },   // Cloudinary URL
  status:     { type: String, enum: ['published', 'draft'], default: 'published' },
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);
