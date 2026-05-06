import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  name_ar:          { type: String, trim: true },
  email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:         { type: String, required: true, minlength: 6 },
  phone:            { type: String, default: '' },
  country:          { type: String, default: '' },
  role:             { type: String, enum: ['admin', 'student'], default: 'student' },
  language:         { type: String, enum: ['ar', 'en'], default: 'ar' },
  enrolledCourses:  [{ type: String }],
  avatar:           { type: String, default: '' },
  status:           { type: String, enum: ['active', 'inactive', 'banned'], default: 'active' },
  googleId:         { type: String, unique: true, sparse: true },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// Never return password in JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);
