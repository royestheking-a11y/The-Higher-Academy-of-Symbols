import mongoose from 'mongoose';

const areaSchema = new mongoose.Schema({
  name_ar:        { type: String, required: true },
  name_en:        { type: String, required: false },
  slug:           { type: String, required: true, unique: true },
  icon:           { type: String, default: 'Star' },
  description_ar: { type: String },
  description_en: { type: String },
  whatItMeans_ar: { type: String },
  whatItMeans_en: { type: String },
  image:          { type: String, default: '' },   // Cloudinary URL
  whatYouWillLearn_ar: [{ type: String }],
  whatYouWillLearn_en: [{ type: String }],
  order:          { type: Number, default: 0 , index: true },
  status:         { type: String, enum: ['published', 'draft'], default: 'published' , index: true },
}, { timestamps: true });

export default mongoose.model('AreaOfStudy', areaSchema);
