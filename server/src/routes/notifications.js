import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

// GET notifications for current user (or admin)
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.role === 'admin' ? 'admin' : req.user._id.toString();
    const notifications = await Notification.find({
      $or: [{ userId }, { userId: 'all' }]
    }).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST — internal only (called by other routes)
router.post('/', protect, async (req, res) => {
  try { res.status(201).json(await Notification.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

// PATCH /:id — mark as read
router.patch('/:id', protect, async (req, res) => {
  try {
    const n = await Notification.findByIdAndUpdate(req.params.id, { status: 'read' }, { new: true });
    res.json(n);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE — clear all for user
router.delete('/clear', protect, async (req, res) => {
  try {
    const userId = req.user.role === 'admin' ? 'admin' : req.user._id.toString();
    await Notification.deleteMany({ userId });
    res.json({ message: 'Cleared' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
