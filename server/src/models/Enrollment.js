import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  userId:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userLegacyId:     { type: String },  // kept for compatibility with seeded data
  userName:         { type: String },
  userEmail:        { type: String },
  courseId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture', required: true },
  courseLegacyId:   { type: String },
  courseTitle:      { type: String },
  amount:           { type: Number, default: 0 },
  paymentMethod:    { type: String, enum: ['card', 'ibanking', 'bank_transfer', 'free'], default: 'card' },
  paymentStatus:    { type: String, enum: ['pending', 'paid', 'failed', 'refunded', 'pending_approval'], default: 'pending' },
  enrollmentStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending' },
  transactionId:    { type: String, default: '' },
  notes:            { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Enrollment', enrollmentSchema);
