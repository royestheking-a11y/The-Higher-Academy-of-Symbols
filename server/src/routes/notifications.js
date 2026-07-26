import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

// GET notifications for current user (or admin)
router.get('/', protect, async (req, res, next) => {
  try {
    const userId = req.user.role === 'admin' ? 'admin' : req.user._id.toString();
    const notifications = await Notification.find({
      $or: [{ userId }, { userId: 'all' }]
    }).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (err) { next(err); }
});

// POST — internal only (called by other routes)
router.post('/', protect, async (req, res, next) => {
  try { res.status(201).json(await Notification.create(req.body)); }
  catch (err) { next(err); }
});

// PATCH /:id — mark as read
router.patch('/:id', protect, async (req, res, next) => {
  try {
    const n = await Notification.findByIdAndUpdate(req.params.id, { status: 'read' }, { new: true, runValidators: true });
    res.json(n);
  } catch (err) { next(err); }
});

// DELETE — clear all for user
router.delete('/clear', protect, async (req, res, next) => {
  try {
    const userId = req.user.role === 'admin' ? 'admin' : req.user._id.toString();
    await Notification.deleteMany({ userId });
    res.json({ message: 'Cleared' });
  } catch (err) { next(err); }
});

export default router;
