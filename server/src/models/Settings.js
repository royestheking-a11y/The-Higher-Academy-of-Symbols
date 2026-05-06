import mongoose from 'mongoose';

// Singleton pattern — only one settings document ever exists
const settingsSchema = new mongoose.Schema({
  siteName_ar:          { type: String, default: 'الأكاديمية العليا للرموز' },
  siteName_en:          { type: String, default: 'The Higher Academy of Symbols' },
  tagline_ar:           { type: String },
  tagline_en:           { type: String },
  heroTitle_ar:         { type: String },
  heroTitle_en:         { type: String },
  heroSubtitle_ar:      { type: String },
  heroSubtitle_en:      { type: String },
  heroDescription_ar:   { type: String },
  heroDescription_en:   { type: String },
  aboutText_ar:         { type: String },
  aboutText_en:         { type: String },
  vision_ar:            { type: String },
  vision_en:            { type: String },
  mission_ar:           { type: String },
  mission_en:           { type: String },
  phone1:               { type: String },
  phone2:               { type: String },
  email:                { type: String },
  address_ar:           { type: String },
  address_en:           { type: String },
  announcement_ar:      { type: String },
  announcement_en:      { type: String },
  announcementLink:     { type: String },
  announcementEnabled:  { type: Boolean, default: true },
  founderName_ar:       { type: String },
  founderName_en:       { type: String },
  founderTitle_ar:      { type: String },
  founderTitle_en:      { type: String },
  founderBio_ar:        { type: String },
  founderBio_en:        { type: String },
  founderImage:         { type: String, default: '' },   // Cloudinary URL
  logoUrl:              { type: String, default: '' },   // Cloudinary URL
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
