import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  serialNo:     { type: Number },
  name_ar:      { type: String, required: true },
  name_en:      { type: String, required: false },
  price:        { type: Number, default: 0 },
  duration_days:{ type: Number, default: 30 },
  features_ar:  [{ type: String }],
  features_en:  [{ type: String }],
  status:       { type: String, enum: ['active', 'inactive'], default: 'active' , index: true },
}, { timestamps: true });

export default mongoose.model('Package', packageSchema);
