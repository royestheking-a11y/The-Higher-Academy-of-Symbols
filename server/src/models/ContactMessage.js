import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true },
  phone:      { type: String, default: '' },
  subject_ar: { type: String },
  subject_en: { type: String },
  message_ar: { type: String },
  message_en: { type: String },
  status:     { type: String, enum: ['new', 'read', 'replied', 'archived'], default: 'new' },
  date:       { type: String, default: () => new Date().toISOString() },
}, { timestamps: true });

export default mongoose.model('ContactMessage', contactMessageSchema);
