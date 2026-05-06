import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName:     { type: String },
  userEmail:    { type: String },
  packageId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  packageName:  { type: String },
  price:        { type: Number, default: 0 },
  startDate:    { type: Date, default: Date.now },
  endDate:      { type: Date },
  status:       { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
  paymentMethod:{ type: String, default: 'manual' },
  transactionId:{ type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Subscription', subscriptionSchema);
