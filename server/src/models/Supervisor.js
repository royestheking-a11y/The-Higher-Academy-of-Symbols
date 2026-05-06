import mongoose from 'mongoose';

const supervisorSchema = new mongoose.Schema({
  serialNo:     { type: Number },
  name:         { type: String, required: true },
  name_ar:      { type: String },
  email:        { type: String },
  phone:        { type: String, default: '' },
  specialty_ar: { type: String },
  specialty_en: { type: String },
  bio_ar:       { type: String, default: '' },
  bio_en:       { type: String, default: '' },
  avatar:       { type: String, default: '' },   // Cloudinary URL
  status:       { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('Supervisor', supervisorSchema);
