import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId:     { type: String, required: true },   // ObjectId string or 'admin' or 'all'
  title_ar:   { type: String, required: true },
  title_en:   { type: String, required: true },
  message_ar: { type: String },
  message_en: { type: String },
  type:       { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
  status:     { type: String, enum: ['unread', 'read'], default: 'unread' },
  link:       { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
