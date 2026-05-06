import mongoose from 'mongoose';

const areaSchema = new mongoose.Schema({
  name_ar:        { type: String, required: true },
  name_en:        { type: String, required: true },
  slug:           { type: String, required: true, unique: true },
  icon:           { type: String, default: 'Star' },
  description_ar: { type: String },
  description_en: { type: String },
  image:          { type: String, default: '' },   // Cloudinary URL
  order:          { type: Number, default: 0 },
  status:         { type: String, enum: ['published', 'draft'], default: 'published' },
}, { timestamps: true });

export default mongoose.model('AreaOfStudy', areaSchema);
