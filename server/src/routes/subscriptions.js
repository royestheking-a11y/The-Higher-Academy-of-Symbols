import express from 'express';
import Subscription from '../models/Subscription.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = express.Router();

router.get('/', protect, adminOnly, async (req, res, next) => {
  try { res.json(await Subscription.find().sort({ createdAt: -1 })); }
  catch (err) { next(err); }
});

router.post('/', protect, adminOnly, async (req, res, next) => {
  try { res.status(201).json(await Subscription.create(req.body)); }
  catch (err) { next(err); }
});

router.patch('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const s = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!s) return res.status(404).json({ message: 'Not found' });
    res.json(s);
  } catch (err) { next(err); }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try { await Subscription.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { next(err); }
});

export default router;
