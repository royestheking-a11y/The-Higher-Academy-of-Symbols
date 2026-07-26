import express from 'express';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = express.Router();

router.get('/', protect, adminOnly, async (req, res, next) => {
  try { res.json(await User.find().sort({ createdAt: -1 })); }
  catch (err) { next(err); }
});

router.patch('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const allowed = ['name', 'name_ar', 'phone', 'country', 'language', 'status', 'role', 'avatar', 'enrolledCourses'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) { next(err); }
});

export default router;
