import express from 'express';
import Package from '../models/Package.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try { res.json(await Package.find().sort({ serialNo: 1 })); }
  catch (err) { next(err); }
});

router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const count = await Package.countDocuments();
    res.status(201).json(await Package.create({ ...req.body, serialNo: count + 1 }));
  } catch (err) { next(err); }
});

router.patch('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const p = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) { next(err); }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try { await Package.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { next(err); }
});

export default router;
