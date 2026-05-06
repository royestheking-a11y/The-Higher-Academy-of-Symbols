import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title_ar:  { type: String },
  title_en:  { type: String },
  duration:  { type: String },
  free:      { type: Boolean, default: false },
  videoUrl:  { type: String, default: '' },    // Cloudinary URL
  pdfUrl:    { type: String, default: '' },     // Cloudinary URL
});

const moduleSchema = new mongoose.Schema({
  module_ar: { type: String },
  module_en: { type: String },
  lessons:   [lessonSchema],
});

const faqSchema = new mongoose.Schema({
  q_ar: String, q_en: String,
  a_ar: String, a_en: String,
});

const lectureSchema = new mongoose.Schema({
  title_ar:          { type: String, required: true },
  title_en:          { type: String, required: true },
  slug:              { type: String, required: true, unique: true },
  description_ar:    { type: String },
  description_en:    { type: String },
  price:             { type: Number, default: 0 },
  duration:          { type: String },
  lessonsCount:      { type: Number, default: 0 },
  lecturer_ar:       { type: String },
  lecturer_en:       { type: String },
  category:          { type: String },
  category_ar:       { type: String },
  category_en:       { type: String },
  level_ar:          { type: String },
  level_en:          { type: String },
  language_ar:       { type: String },
  language_en:       { type: String },
  certificate:       { type: Boolean, default: false },
  featured:          { type: Boolean, default: false },
  status:            { type: String, enum: ['published', 'draft', 'archived'], default: 'draft' },
  enrolled:          { type: Number, default: 0 },
  rating:            { type: Number, default: 0 },
  reviews:           { type: Number, default: 0 },
  thumbnail:         { type: String, default: '' },   // Cloudinary URL
  previewVideo:      { type: String, default: '' },   // Cloudinary URL
  whatYouLearn_ar:   [{ type: String }],
  whatYouLearn_en:   [{ type: String }],
  requirements_ar:   [{ type: String }],
  requirements_en:   [{ type: String }],
  targetStudents_ar: [{ type: String }],
  targetStudents_en: [{ type: String }],
  curriculum:        [moduleSchema],
  faq:               [faqSchema],
}, { timestamps: true });

export default mongoose.model('Lecture', lectureSchema);
